import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log("[AuthContext] Using API URL:", API_BASE_URL);


// Define the shape of our user object from the decoded JWT
interface User {
  id: string;
  username?: string;
  email?: string;
  // Add other user properties as needed
}

// Define the shape of our context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  loginWithCredentials: async () => false,
  logout: () => {},
  loading: true
});

// Token storage key
const TOKEN_KEY = 'auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Function to check if a token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      // Check if the expiration time is less than the current time
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      // If there's an error decoding, consider the token invalid
      return true;
    }
  };

  // Function to validate and set user from a token
  const validateToken = (token: string) => {
    try {
      if (isTokenExpired(token)) {
        // Token is expired, clear auth states
        logout();
        setLoading(false);
        return false;
      }

      // Decode the token to get user information
      const decoded: any = jwtDecode(token);
      
      // Set authenticated state
      setToken(token);
      setUser({ id: decoded.user.id });
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error) {
      // If there's an error, clear auth state
      console.error('Error validating token:', error);
      logout();
      setLoading(false);
      return false;
    }
  };

  // Function to handle login with token
  const login = (newToken: string) => {
    // Save token to localStorage
    localStorage.setItem(TOKEN_KEY, newToken);
    validateToken(newToken);
  };

  // Function to handle login with credentials
  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token } = response.data;
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Save and validate the token
      login(token);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  // Function to handle logout
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem(TOKEN_KEY);
    // Reset auth state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // On component mount, check if there's a saved token
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        validateToken(savedToken);
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);


  const authContextValue = useMemo(() => ({
    isAuthenticated, 
    user, 
    token, 
    login, 
    loginWithCredentials,
    logout, 
    loading 
  }), [isAuthenticated, user, token, loading]);
  

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Add this import

// API endpoint URLs - adjust as needed
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth` : "http://localhost:5000/api/auth";

interface FormData {
  username?: string;
  email: string;
  password: string;
}

const AuthForm: React.FC = () => {
  // Tab state (sign-in or sign-up)
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get auth context functions and state
  const { loginWithCredentials, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  console.log("[AuthForm] Initial render, isAuthenticated:", isAuthenticated);
  
  // Monitor authentication state changes
  useEffect(() => {
    console.log("[AuthForm] Auth state changed, isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      console.log("[AuthForm] User is authenticated, should redirect soon");
    }
  }, [isAuthenticated]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear previous errors when user types
  };
  
  // Sign up API helper function
  const registerUser = async (userData: FormData) => {
    console.log("[AuthForm] Attempting to register user:", userData.email);
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/register`, userData);
      console.log("[AuthForm] Registration successful:", response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      console.error("[AuthForm] Registration error:", err);
      setIsLoading(false);
      if (axios.isAxiosError(err) && err.response) {
        throw new Error(err.response.data.msg || "Registration failed");
      }
      throw new Error("Network error during registration");
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Basic form validation
      if (activeTab === "signup" && !formData.username?.trim()) {
        setError("Username is required");
        return;
      }
      
      if (!formData.email?.trim()) {
        setError("Email is required");
        return;
      }
      
      if (!formData.password?.trim()) {
        setError("Password is required");
        return;
      }
      
      if (activeTab === "signup" && formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      
      // Call the appropriate API based on active tab
      if (activeTab === "signup") {
        console.log("[AuthForm] Processing signup form");
        const result = await registerUser(formData);
        console.log("[AuthForm] Registration successful, switching to signin");
        // After successful registration, switch to sign-in
        setActiveTab("signin");
      } else {
        console.log("[AuthForm] Processing signin form");
        const { email, password } = formData;
        
        // HERE IS THE KEY CHANGE: Use the context's login function
        // instead of directly manipulating localStorage
        const success = await loginWithCredentials(email, password);
        console.log("[AuthForm] Login attempt result:", success);
        
        if (success) {
          console.log("[AuthForm] Login successful, redirecting to /summoner");
          navigate("/summoner"); 
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("[AuthForm] Form submission error:", err.message);
        setError(err.message);
      } else {
        console.error("[AuthForm] Unexpected error:", err);
        setError("An unexpected error occurred");
      }
    }
  };
  
  // Animation variants for tab switching
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="bg-[#2C2F33] rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      {/* Tab navigation */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
          className={`py-2 px-4 text-lg font-medium ${
            activeTab === "signin"
              ? "text-[#5865F2] border-b-2 border-[#5865F2]"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("signin")}
        >
          Sign In
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${
            activeTab === "signup"
              ? "text-[#5865F2] border-b-2 border-[#5865F2]"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
      </div>
      
      {/* Form container with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field (only on sign-up) */}
            {activeTab === "signup" && (
              <div>
                <label htmlFor="username" className="block text-white mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#23272A] text-white rounded border border-gray-700 focus:border-[#5865F2] focus:outline-none"
                  placeholder="Enter username"
                />
              </div>
            )}
            
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#23272A] text-white rounded border border-gray-700 focus:border-[#5865F2] focus:outline-none"
                placeholder="Enter email"
              />
            </div>
            
            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-white mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#23272A] text-white rounded border border-gray-700 focus:border-[#5865F2] focus:outline-none"
                placeholder="Enter password"
              />
            </div>
            
            {/* Error message display */}
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                {error}
              </div>
            )}
            
            {/* Submit button with loading state */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded bg-[#5865F2] text-white font-medium hover:bg-[#4b55d6] transition-all duration-300 disabled:opacity-50 flex justify-center items-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {activeTab === "signin"
                ? isLoading
                  ? "Signing In..."
                  : "Sign In"
                : isLoading
                ? "Signing Up..."
                : "Sign Up"}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
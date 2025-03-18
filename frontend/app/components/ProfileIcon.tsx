import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Adjust import path as needed

const ProfileIcon: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Log initial render
  console.log("[ProfileIcon] Rendering, isAuthenticated:", isAuthenticated);

   // Monitor authentication state changes
  useEffect(() => {
    console.log("[ProfileIcon] Auth state changed, isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

   // Monitor dropdown state changes
   useEffect(() => {
    console.log("[ProfileIcon] Dropdown state changed:", dropdownOpen ? "open" : "closed");
  }, [dropdownOpen]);

   // Close dropdown when clicking outside
   useEffect(() => {
    console.log("[ProfileIcon] Setting up click outside handler");
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log("[ProfileIcon] Click detected outside dropdown, closing");
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log("[ProfileIcon] Cleaning up click outside handler");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    console.log("[ProfileIcon] Toggle dropdown, current state:", dropdownOpen, "new state:", !dropdownOpen);
    setDropdownOpen(prev => !prev);
  };
  
  const handleSignOut = () => {
    console.log("[ProfileIcon] Sign out clicked, current auth state:", isAuthenticated);
    logout();
    console.log("[ProfileIcon] After logout() call");
    setDropdownOpen(false);
    navigate("/");
    console.log("[ProfileIcon] Navigation to home complete");
  };

  const handleComingSoonRedirect = (feature: string) => {
    console.log(`[ProfileIcon] ${feature} clicked (coming soon feature)`);
    alert(`${feature} is coming soon!`);
    navigate("/summoner");
    setDropdownOpen(false);
  };

  // Log what will be rendered based on authentication
  console.log("[ProfileIcon] Before render, will show:", isAuthenticated ? "authenticated options" : "login/register options");

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button 
        onClick={toggleDropdown}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
        aria-label="User menu"
        aria-expanded={dropdownOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleComingSoonRedirect("Profile Settings")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </button>
              <button
                onClick={() => handleComingSoonRedirect("User Dashboard")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                User Dashboard
              </button>
              <hr className="my-1" />
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Login/Register
              </Link>
              {/* <Link
                to="/register"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Register
              </Link> */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
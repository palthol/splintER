import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-gray-900 text-white shadow relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-xl font-bold">
            Project Splinter.
          </Link>
          
          <div className="flex items-center">
            {/* Desktop nav links */}
            <div className="hidden md:flex space-x-4 items-center">
              <Link to="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/summoner" className="hover:text-gray-300">
                Summoner Search
              </Link>
              <Link to="/profile" className="hover:text-gray-300">
                Profile
              </Link>
            </div>
            
            {/* Profile Icon - visible on all screen sizes */}
            <div className="ml-4">
              <ProfileIcon />
            </div>
            
            {/* Mobile hamburger menu */}
            <div className="md:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="focus:outline-none"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  // X Icon
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                    <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  // Hamburger Icon
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
                    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
                    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 shadow z-50">
            <div className="flex flex-col space-y-2 pb-3">
              <Link
                onClick={closeMenu}
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <Link
                onClick={closeMenu}
                to="/summoner"
                className="block px-4 py-2 hover:bg-gray-800"
              >
                Summoner Search
              </Link>
              <Link
                onClick={closeMenu}
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-800"
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
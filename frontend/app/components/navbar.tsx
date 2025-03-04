import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-gray-900 text-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-xl font-bold">
            Splinter.
          </Link>
          {/* Desktop nav links */}
          <div className="hidden md:flex space-x-4">
            <Link to="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            <Link to="/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </div>
          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Top line */}
                <motion.path
                  fill="currentColor"
                  variants={{
                    closed: { d: "M3 7h18", rotate: 0, translateY: 0 },
                    open: { d: "M4 4l16 16", rotate: 45, translateY: 0 },
                  }}
                  initial="closed"
                  animate={menuOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
                {/* Middle line */}
                <motion.path
                  fill="currentColor"
                  variants={{
                    closed: { d: "M3 12h18", opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  initial="closed"
                  animate={menuOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
                {/* Bottom line */}
                <motion.path
                  fill="currentColor"
                  variants={{
                    closed: { d: "M3 17h18", rotate: 0, translateY: 0 },
                    open: { d: "M4 20l16 -16", rotate: -45, translateY: 0 },
                  }}
                  initial="closed"
                  animate={menuOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
              </motion.svg>
            </button>
          </div>
        </div>
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="md:hidden">
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
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-800"
              >
                Profile
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu state for mobile
  const navbarRef = useRef(null); // Create a reference for the navbar

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle mobile menu visibility
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close the menu if the click is outside the navbar
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close the menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 p-4 fixed top-0 left-0 w-full z-50" ref={navbarRef}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo or App Name */}
        <div>
          <img
            src="/images/logos1.jpg"
            alt="MyDatafy Logo"
            className="h-14 w-auto" // Adjust height and width as needed
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navbar Links (Desktop view) */}
        <div className="hidden sm:flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300 transition duration-300">Home</Link>
          <Link to="/about" className="text-white hover:text-gray-300 transition duration-300">About</Link>
          <Link to="/login" className="text-white hover:text-gray-300 transition duration-300">Login</Link>
          <Link to="/register" className="text-white hover:text-gray-300 transition duration-300">Sign Up</Link>
        </div>
      </div>

      {/* Mobile Menu (Visible when menu is open) */}
      <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"} mt-4 space-y-4`}>
        <Link to="/" onClick={handleLinkClick} className="block text-white hover:text-gray-300 transition duration-300">Home</Link>
        <Link to="/about" onClick={handleLinkClick} className="block text-white hover:text-gray-300 transition duration-300">About</Link>
        <Link to="/login" onClick={handleLinkClick} className="block text-white hover:text-gray-300 transition duration-300">Login</Link>
        <Link to="/register" onClick={handleLinkClick} className="block text-white hover:text-gray-300 transition duration-300">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;

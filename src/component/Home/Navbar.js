import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo or App Name */}
       {/* Logo or App Name */}
<div>
  <img
    src="/images/logos1.jpg"
    alt="MyDatafy Logo"
    className="h-14 w-auto" // Adjust height and width as needed
  />
</div>


        {/* Navbar Links */}
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/about" className="text-white hover:text-gray-300">About</Link>
          <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          <Link to="/register" className="text-white hover:text-gray-300">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

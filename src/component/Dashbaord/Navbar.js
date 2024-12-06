import React from "react";

const Navbar = ({ ministry, department, onToggleSidebar }) => {
  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 text-white">
      {/* Left side (Hamburger menu & Title) */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="block lg:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </div>

      {/* Right side (Ministry and Department info) */}
      <div className="text-sm hidden lg:flex">
        {ministry ? (
          <>
            <span className="mr-4">Ministry: {ministry}</span>
            <span>Department: {department}</span>
          </>
        ) : (
          <span>Please select a Ministry and Department</span>
        )}
      </div>

      {/* Ministry and Department info for mobile */}
      <div className="text-sm lg:hidden">
        {ministry ? (
          <>
            <span className="mr-4 block">Ministry: {ministry}</span>
            <span className="block">Department: {department}</span>
          </>
        ) : (
          <span>Please select a Ministry and Department</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

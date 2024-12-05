import React from "react";

const Navbar = ({ ministry, department }) => {
  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 text-white">
      <h1 className="text-lg font-bold">Admin Dashboard</h1>
      <div className="text-sm">
        <span className="mr-4">Ministry: {ministry}</span>
        <span>Department: {department}</span>
      </div>
    </nav>
  );
};

export default Navbar;

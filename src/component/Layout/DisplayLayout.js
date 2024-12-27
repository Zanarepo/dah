import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // This will render nested routes
import DisplaySettings from "../SuperAdmins/DisplaySettings"; // Assuming this is where the theme is toggled

const DisplaLayout = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Apply the theme globally by updating the body's className
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800";
  }, [theme]);

  return (
    <div>
      {/* You can add global navigation, header, or other layout elements here */}
      <DisplaySettings setTheme={setTheme} />
      {/* Outlet renders the child routes that match */}
      <div className="min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default DisplaLayout;

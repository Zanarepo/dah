import React from 'react';
import { useTheme } from '../ThemeContext'; // Use the custom hook to access the theme

const DisplaySettings = () => {
  const { theme, setTheme } = useTheme(); // Access the current theme and the setter

  const handleToggle = (mode) => {
    setTheme(mode); // Change the theme when a button is clicked
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Display Settings</h2>
      <p className="text-gray-600 mb-4 text-center">Choose your preferred display mode:</p>

      {/* Button Container: Flexbox with reduced spacing */}
      <div className="flex flex-col sm:flex-row sm:space-x-2 sm:gap-0 space-y-2 sm:space-y-0 mb-4 justify-center">
        <button
          onClick={() => handleToggle("light")}
          className={`w-full sm:w-auto px-3 py-2 rounded-md text-lg font-medium ${theme === "light" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        >
          Light Mode
        </button>

        <button
          onClick={() => handleToggle("dark")}
          className={`w-full sm:w-auto px-3 py-2 rounded-md text-lg font-medium ${theme === "dark" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        >
          Dark Mode
        </button>

        <button
          onClick={() => handleToggle("custom")}
          className={`w-full sm:w-auto px-3 py-2 rounded-md text-lg font-medium ${theme === "custom" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        >
          Custom Mode
        </button>
      </div>

      {/* Custom Mode Info */}
      {theme === "custom" && (
        <div className="text-center">
          <p className="text-gray-600 text-sm">Custom mode is selected. You can further customize the appearance in advanced settings.</p>
        </div>
      )}
    </div>
  );
};

export default DisplaySettings;

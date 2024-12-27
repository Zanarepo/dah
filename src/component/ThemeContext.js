import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Apply the theme globally to the body element
    document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

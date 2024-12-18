import React from "react";


const ProfileLayout = ({ children }) => {
  return (
    <div>
      {/* Common Layout */}
      <header className="bg-teal-600 text-white p-4">
        <h1>Profile Section</h1>
      </header>

      {/* Render the child component */}
      <main className="p-4">{children}</main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 Profile Portal</p>
      </footer>
    </div>
  );
};

export default ProfileLayout;

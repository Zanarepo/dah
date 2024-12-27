import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();

    // Show toast notification
    toast.success("You have successfully logged out!");

    // Redirect to login page after a slight delay
    setTimeout(() => {
      navigate("/login");
    }, 2000); // Redirect after 2 seconds
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Are you sure you want to log out?
        </h2>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 focus:outline-none"
          >
            Logout
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;

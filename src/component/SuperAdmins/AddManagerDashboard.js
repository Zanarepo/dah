import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for back navigation
import AddManager from "../admin/AddManager"; // Ensure AddManager is imported
import DeleteManager from "../admin/DeleteManager"; // Ensure DeleteManager is imported

const AddManagerDashboard = () => {
  const [isAddManagerVisible, setIsAddManagerVisible] = useState(false);
  const [isDeleteManagerVisible, setIsDeleteManagerVisible] = useState(false);

  const toggleAddManager = () => setIsAddManagerVisible(!isAddManagerVisible);
  const toggleDeleteManager = () => setIsDeleteManagerVisible(!isDeleteManagerVisible);

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative max-w-4xl w-full bg-white shadow-lg p-6 rounded-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 transition duration-300"
        >
          &larr; Back
        </button>

        {/* Header Section */}
        <div className="pt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Manager Management Dashboard
          </h2>
          <p className="text-gray-700 text-center mb-8">
            Welcome to the Manager Management Dashboard. Below you can add or
            delete managers.
          </p>
        </div>

        {/* Dashboard Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Button to Add Manager */}
          <div className="flex justify-center">
            <button
              onClick={toggleAddManager}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Add Manager
            </button>
          </div>

          {/* Button to Delete Manager */}
          <div className="flex justify-center">
            <button
              onClick={toggleDeleteManager}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Delete Manager
            </button>
          </div>
        </div>

        {/* Conditional Rendering for Components */}
        {isAddManagerVisible && (
          <div className="mt-6">
            <AddManager />
          </div>
        )}
        {isDeleteManagerVisible && (
          <div className="mt-6">
            <DeleteManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddManagerDashboard;

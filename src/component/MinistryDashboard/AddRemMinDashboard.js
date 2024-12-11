import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for back navigation
import AddMinistryDepartment from "./AddMinistryDepartment"
import RemoveMinDepartmement from "./RemoveMinDepartmement"; // Ensure RemoveDepartment is imported




              
              

const AddDepartmentDashboard = () => {
  const [isAddDepartmentVisible, setIsAddDepartmentVisible] = useState(false);
  const [isRemoveDepartmentVisible, setIsRemoveDepartmentVisible] = useState(false);

  const toggleAddDepartment = () => setIsAddDepartmentVisible(!isAddDepartmentVisible);
  const toggleRemoveDepartment = () => setIsRemoveDepartmentVisible(!isRemoveDepartmentVisible);

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
            Department Management Dashboard
          </h2>
          <p className="text-gray-700 text-center mb-8">
            Welcome to the Department Management Dashboard. Below you can add or
            remove departments from the database.
          </p>
        </div>

        {/* Dashboard Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Button to Add Department */}
          <div className="flex justify-center">
            <button
              onClick={toggleAddDepartment}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Add Department
            </button>
          </div>

          {/* Button to Remove Department */}
          <div className="flex justify-center">
            <button
              onClick={toggleRemoveDepartment}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Remove Department
            </button>
          </div>
        </div>

        {/* Conditional Rendering for Components */}
        {isAddDepartmentVisible && (
          <div className="mt-6">
            <AddMinistryDepartment />
          </div>
        )}
        {isRemoveDepartmentVisible && (
          <div className="mt-6">
            <RemoveMinDepartmement />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDepartmentDashboard;

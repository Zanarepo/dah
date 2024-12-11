import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing components
import MinRoleAssign from "./MinRoleAssign";
import MinAssignRole from "./MinAssignRole";
import MinDeleteAccess from "./MinDeleteAccess";

const SuperAdminDashboard = () => {
  const [isAssignRoleVisible, setIsAssignRoleVisible] = useState(false);
  const [isRoleAssignmentVisible, setIsRoleAssignmentVisible] = useState(false);
  const [isDeleteAccessVisible, setIsDeleteAccessVisible] = useState(false);

  const navigate = useNavigate();

  // Toggle functions for visibility of sections
  const toggleMinAssignRole = () => setIsAssignRoleVisible(!isAssignRoleVisible);
  const toggleMinRoleAssign = () =>
    setIsRoleAssignmentVisible(!isRoleAssignmentVisible);
  const toggleMinDeleteAccess = () =>
    setIsDeleteAccessVisible(!isDeleteAccessVisible);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative max-w-4xl w-full bg-white shadow-lg p-6 rounded-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 transition duration-300"
        >
          &larr; Back
        </button>

        {/* Header Section */}
        <div className="pt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Minstry Admin Dashboard
          </h2>
          <p className="text-gray-700 text-center mb-8">
            Welcome to the Ministry Admin Dashboard. Below you can manage roles,
            assign managers, and delete admin access at department levels.
          </p>
        </div>

        {/* Dashboard Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex justify-center">
            <button
              onClick={toggleMinAssignRole}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Assign Roles
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={toggleMinRoleAssign}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              Assign Manager Role
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={toggleMinDeleteAccess}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Delete Admin Access
            </button>
          </div>
        </div>

        {/* Conditional Rendering for Components */}
        {isAssignRoleVisible && (
          <div className="mt-6">
            <MinAssignRole />
          </div>
        )}
        {isRoleAssignmentVisible && (
          <div className="mt-6">
            <MinRoleAssign />
          </div>
        )}
        {isDeleteAccessVisible && (
          <div className="mt-6">
            <MinDeleteAccess />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

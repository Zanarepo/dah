import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AssignRole from "./AssignRole";
import RoleAssignmentManagers from "./RoleAssignmentManagers";
import DeleteAccess from "./DeleteAccess";

const SuperAdminDashboard = () => {
  const [isAssignRoleVisible, setIsAssignRoleVisible] = useState(false);
  const [isRoleAssignmentVisible, setIsRoleAssignmentVisible] = useState(false);
  const [isDeleteAccessVisible, setIsDeleteAccessVisible] = useState(false);

  const toggleAssignRole = () => setIsAssignRoleVisible(!isAssignRoleVisible);
  const toggleRoleAssignment = () =>
    setIsRoleAssignmentVisible(!isRoleAssignmentVisible);
  const toggleDeleteAccess = () =>
    setIsDeleteAccessVisible(!isDeleteAccessVisible);

  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100">
      <div className="relative max-w-4xl w-full bg-white shadow-lg p-6 rounded-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 transition duration-300"
        >
          &larr; Back
        </button>

        {/* Header Section */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Super Admin Dashboard
          </h2>
          <p className="text-gray-700 text-center mb-6">
            Welcome to the Super Admin Dashboard. Below you can manage roles,
            assign managers, and delete admin access.
          </p>
        </div>

        {/* Dashboard Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <button
              onClick={toggleAssignRole}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Assign Roles
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={toggleRoleAssignment}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              Assign Manager Role
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={toggleDeleteAccess}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Delete Admin Access
            </button>
          </div>
        </div>

        {/* Conditional Rendering for Components */}
        {isAssignRoleVisible && (
          <div className="mt-4">
            <AssignRole />
          </div>
        )}
        {isRoleAssignmentVisible && (
          <div className="mt-4">
            <RoleAssignmentManagers />
          </div>
        )}
        {isDeleteAccessVisible && (
          <div className="mt-4">
            <DeleteAccess />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

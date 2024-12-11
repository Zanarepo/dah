import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roles = location.state?.roles || []; // Get roles from state

  const handleRoleSelect = (route) => {
    navigate(route); // Navigate to the selected route
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
      <p className="mb-4">You have access to the following routes:</p>
      <div className="flex flex-wrap gap-4 justify-center">
        {roles.map((role) => (
          <button
            key={role.name}
            onClick={() => handleRoleSelect(role.route)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {role.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;

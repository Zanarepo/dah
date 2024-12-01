import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === "admin") {
      navigate("/"); // Redirect to admin dashboard
    } else if (role === "employee") {
      navigate("/profile"); // Redirect to employee dashboard
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
      <p className="mb-4">You have access to both admin and employee dashboards. Please select your role:</p>
      <div className="flex justify-between">
        <button
          onClick={() => handleRoleSelect("admin")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Admin Dashboard
        </button>
        <button
          onClick={() => handleRoleSelect("employee")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Employee Dashboard
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;

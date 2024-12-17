import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const RoleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve roles from location state or set default empty array
  const [roles] = useState(location.state?.roles || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no roles are passed, show an error toast
    if (!roles.length) {
      toast.error("No roles available. Please check your permissions.");
    }
  }, [roles]);

  const handleRoleSelect = (route) => {
    setLoading(true);
    navigate(route); // Navigate to the selected route
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Select Your Role</h2>
        <p className="text-center text-gray-600 mb-6">You have access to the following routes:</p>

        {/* Show a loading state if necessary */}
        {loading ? (
          <div className="flex justify-center items-center mb-6">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V2a10 10 0 00-10 10h2z"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {roles.length > 0 ? (
              roles.map((role) => (
                <button
                  key={role.name}
                  onClick={() => handleRoleSelect(role.route)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 transform hover:scale-105"
                >
                  {role.name}
                </button>
              ))
            ) : (
              <div className="text-center text-gray-500 w-full">
                No roles available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;

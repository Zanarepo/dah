import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddMinistryForm from "../admin/AddMinistryForm";
import RemoveMinistry from "../admin/RemoveMinistry";

const AddMinistryDashboard = () => {
  const [isAddMinistryVisible, setIsAddMinistryVisible] = useState(false);
  const [isRemoveMinistryVisible, setIsRemoveMinistryVisible] = useState(false);

  const toggleAddMinistry = () => setIsAddMinistryVisible(!isAddMinistryVisible);
  const toggleRemoveMinistry = () => setIsRemoveMinistryVisible(!isRemoveMinistryVisible);

  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-center min-h-screen pt-4">
      <div className="relative max-w-4xl w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 transition duration-300"
        >
          &larr; Back
        </button>

        {/* Header Section */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Ministry Management Dashboard</h2>
          <p className="text-gray-700 text-center mb-6">
            Welcome to the Ministry Management Dashboard. Below you can add or remove ministries from your database.
          </p>
        </div>

        {/* Dashboard Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-center">
            <button
              onClick={toggleAddMinistry}
              className="w-40 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              Add Ministry
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={toggleRemoveMinistry}
              className="w-40 bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Remove Ministry
            </button>
          </div>
        </div>

        {/* Conditional Rendering for Components */}
        {isAddMinistryVisible && (
          <div className="mt-6">
            <AddMinistryForm />
          </div>
        )}

        {isRemoveMinistryVisible && (
          <div className="mt-6">
            <RemoveMinistry />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMinistryDashboard;

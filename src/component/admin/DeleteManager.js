import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const DeleteManager = () => {
  const [managers, setManagers] = useState([]); // List of managers with employee details
  const [selectedManagers, setSelectedManagers] = useState([]); // List of selected managers for deletion
  const [error, setError] = useState(""); // Error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [showConfirmation, setShowConfirmation] = useState(false); // Show confirmation modal

  // Fetch managers with employee details
  const fetchManagers = async () => {
    try {
      // Fetch the list of managers
      const { data: managersData, error: managersError } = await supabase
        .from("managers")
        .select("id, employee_id, role");

      if (managersError) {
        setError("Error fetching managers.");
        console.error(managersError);
        return;
      }

      // Fetch employee details for the managers
      const employeeIds = managersData.map(manager => manager.employee_id);
      const { data: employeeProfiles, error: employeeError } = await supabase
        .from("employee_profiles")
        .select("employee_id, first_name, last_name")
        .in("employee_id", employeeIds);

      if (employeeError) {
        setError("Error fetching employee profiles.");
        console.error(employeeError);
        return;
      }

      // Combine the data from managers and employee_profiles
      const managersWithDetails = managersData.map(manager => {
        const employee = employeeProfiles.find(
          (emp) => emp.employee_id === manager.employee_id
        );
        return {
          ...manager,
          first_name: employee?.first_name,
          last_name: employee?.last_name,
        };
      });

      setManagers(managersWithDetails); // Set the combined list of managers with names
    } catch (error) {
      setError("An error occurred while fetching the managers.");
      console.error(error);
    }
  };

  // Handle selecting/deselecting a manager for deletion
  const handleSelectManager = (managerId) => {
    setSelectedManagers((prevSelected) =>
      prevSelected.includes(managerId)
        ? prevSelected.filter((id) => id !== managerId)
        : [...prevSelected, managerId]
    );
  };

  // Handle the confirmation for deletion
  const handleDeleteConfirmation = async () => {
    if (selectedManagers.length === 0) {
      setError("Please select at least one manager to delete.");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      // Delete selected managers from the "managers" table
      const { error: deleteError } = await supabase
        .from("managers")
        .delete()
        .in("id", selectedManagers);

      if (deleteError) {
        setError("Error deleting managers.");
        setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
        console.error(deleteError);
      } else {
        setSuccessMessage("Managers deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
        setSelectedManagers([]); // Clear selected managers
        setShowConfirmation(false); // Hide confirmation modal
        fetchManagers(); // Refresh the list of managers
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      console.error(err);
    }
  };

  // Fetch managers when the component mounts
  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Delete Manager</h1>

      {/* Error or Success Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md shadow-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md shadow-md">
          {successMessage}
        </div>
      )}

      {/* Manager List */}
      <ul className="space-y-4">
        {managers.map((manager) => (
          <li
            key={manager.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-md hover:bg-gray-50"
          >
            <div className="text-lg font-semibold">
              {manager.first_name} {manager.last_name} - {manager.role}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedManagers.includes(manager.id)}
                onChange={() => handleSelectManager(manager.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">Select</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Button */}
      <button
        onClick={() => setShowConfirmation(true)}
        className="mt-6 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
      >
        Delete Selected Managers
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-4">Are you sure you want to delete the selected managers?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-300 px-6 py-2 rounded-md text-gray-700 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmation}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteManager;

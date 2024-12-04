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
        console.error(deleteError);
      } else {
        setSuccessMessage("Managers deleted successfully!");
        setSelectedManagers([]); // Clear selected managers
        setShowConfirmation(false); // Hide confirmation modal
        fetchManagers(); // Refresh the list of managers
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  // Fetch managers when the component mounts
  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Delete Manager</h1>

      {/* Error or Success Message */}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Manager List */}
      <ul className="space-y-2">
        {managers.map((manager) => (
          <li
            key={manager.id}
            className="flex items-center justify-between p-2 bg-white border rounded-md shadow-md"
          >
            <div>
              {manager.first_name} {manager.last_name} - {manager.role}
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedManagers.includes(manager.id)}
                onChange={() => handleSelectManager(manager.id)}
                className="mr-2"
              />
              Select
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Button */}
      <button
        onClick={() => setShowConfirmation(true)}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Delete Selected Managers
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the selected managers?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmation}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
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

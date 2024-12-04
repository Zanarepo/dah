import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const RemoveManagerFromEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Fetch employees from employee_profiles table
  useEffect(() => {
    const fetchData = async () => {
      const { data: employeeData, error: employeeError } = await supabase
        .from("employee_profiles")
        .select("employee_id, first_name, last_name");

      if (employeeError) {
        setError("Error fetching employees.");
        console.error(employeeError);
      } else {
        setEmployees(employeeData);
      }
    };

    fetchData();
  }, []);

  // Handle employee selection for removing manager
  const handleCheckboxChange = (employee_id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employee_id)
        ? prevSelected.filter((id) => id !== employee_id)
        : [...prevSelected, employee_id]
    );
  };

  const handleRemoveManager = async () => {
    if (selectedEmployees.length === 0) {
      setError("Please select at least one employee.");
      return;
    }
  
    try {
      // Log selected employees to confirm they're valid
      console.log("Selected Employees:", selectedEmployees);
  
      // Perform the update in employee_profiles table
      const { data, error: updateError } = await supabase
        .from("employee_profiles")
        .update({ manager_id: null })  // Set manager_id to null
        .in("employee_id", selectedEmployees); // Apply update to the selected employees
  
      if (updateError) {
        setError("Error removing managers from employee profiles.");
        console.error(updateError);
      } else {
        // If update was successful, log the result and show success
        console.log("Update Success: Data", data);
        setSuccessMessage("Manager successfully removed from selected employees.");
        setSelectedEmployees([]); // Reset selected employees
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    }
  };
  
  // Confirm removal of manager and proceed with the partial update
  const confirmRemoveManager = async () => {
    try {
      const updatedEmployees = selectedEmployees.map((employee_id) => ({
        employee_id,
        manager_id: null, // Only update the manager_id field
      }));

      // Update only the manager_id column without affecting other fields
      const { error } = await supabase
        .from("employee_profiles")
        .update({ manager_id: null })  // Setting manager_id to null
        .in("employee_id", selectedEmployees); // Ensure only selected employees are affected

      if (error) {
        setError("Error removing manager.");
        console.error(error);
      } else {
        setSuccessMessage("Manager successfully removed from selected employees.");
        setSelectedEmployees([]); // Reset selected employees
        setShowModal(false); // Close the modal
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  // Cancel manager removal
  const cancelRemoveManager = () => {
    setShowModal(false); // Close the modal without making changes
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Remove Manager from Employees</h1>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Employee Checklist */}
      <div className="mb-4">
        <h2 className="text-xl font-medium">Select Employees</h2>
        <div className="mt-2 space-y-2">
          {employees.map((employee) => (
            <div key={employee.employee_id} className="flex items-center">
              <input
                type="checkbox"
                id={`employee-${employee.employee_id}`}
                checked={selectedEmployees.includes(employee.employee_id)}
                onChange={() => handleCheckboxChange(employee.employee_id)}
                className="mr-2"
              />
              <label htmlFor={`employee-${employee.employee_id}`}>
                {employee.first_name} {employee.last_name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleRemoveManager}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Remove Manager from Employees
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-lg font-medium mb-4">Are you sure you want to remove the manager?</h2>
            <div className="flex justify-between">
              <button
                onClick={confirmRemoveManager}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
              <button
                onClick={cancelRemoveManager}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveManagerFromEmployee;

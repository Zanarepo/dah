import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Adjust the import path based on your project structure

const RemoveDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch departments from the database
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase.from("departments").select("*");
        if (error) throw error;
        setDepartments(data);
      } catch (error) {
        setErrorMessage("Error fetching departments: " + error.message);
      }
    };

    fetchDepartments();
  }, []);

  // Handle confirmation of deletion
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) {
      setErrorMessage("Please select a department to delete.");
      return;
    }

    try {
      // Delete the selected department from the "departments" table
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", selectedDepartment.id);

      if (error) throw error;

      setSuccessMessage("Department deleted successfully!");
      setConfirmationVisible(false); // Hide confirmation dialog
      setSelectedDepartment(null); // Reset selected department
      setErrorMessage(""); // Reset error message

      // Re-fetch departments to update the list
      const { data } = await supabase.from("departments").select("*");
      setDepartments(data);
    } catch (error) {
      setErrorMessage("Error deleting department: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Remove Department</h2>

      {/* Success or Error Messages */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* Department Selection */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Department to Delete</label>
        <select
          className="w-full border border-gray-300 p-2 rounded"
          onChange={(e) => setSelectedDepartment(departments.find(department => department.id === parseInt(e.target.value)))}
          value={selectedDepartment ? selectedDepartment.id : ""}
        >
          <option value="">-- Select a Department --</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Show confirmation popup before deleting */}
      {confirmationVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this department?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setConfirmationVisible(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDepartment}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Button */}
      <button
        onClick={() => setConfirmationVisible(true)}
        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mt-4"
      >
        Delete Department
      </button>
    </div>
  );
};

export default RemoveDepartment;

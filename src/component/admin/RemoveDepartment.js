import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Adjust the import path based on your project structure
import { toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const RemoveDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  // Fetch departments from the database
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase.from("departments").select("*");
        if (error) throw error;
        setDepartments(data);
      } catch (error) {
        toast.error("Error fetching departments: " + error.message); // Use toast.error for error messages
      }
    };

    fetchDepartments();
  }, []);

  // Handle confirmation of deletion
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) {
      toast.error("Please select a department to delete."); // Use toast.error for error messages
      return;
    }

    try {
      // Delete the selected department from the "departments" table
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", selectedDepartment.id);

      if (error) throw error;

      toast.success("Department deleted successfully!"); // Use toast.success for success messages
      setConfirmationVisible(false); // Hide confirmation dialog
      setSelectedDepartment(null); // Reset selected department

      // Re-fetch departments to update the list
      const { data } = await supabase.from("departments").select("*");
      setDepartments(data);
    } catch (error) {
      toast.error("Error deleting department: " + error.message); // Use toast.error for error messages
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Remove Department</h2>

      {/* Department Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Select Department to Delete</label>
        <select
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setSelectedDepartment(
              departments.find((department) => department.id === parseInt(e.target.value))
            )
          }
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

      {/* Confirmation Popup */}
      {confirmationVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700">Are you sure you want to delete this department?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setConfirmationVisible(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDepartment}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
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
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-6"
      >
        Delete Department
      </button>
    </div>
  );
};

export default RemoveDepartment;

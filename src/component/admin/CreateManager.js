import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AssignManagerComponent = () => {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedManager, setSelectedManager] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (error) {
        setError("Error fetching departments.");
        console.error(error);
      } else {
        setDepartments(data);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch existing managers from the 'managers' table
  useEffect(() => {
    const fetchManagers = async () => {
      const { data, error } = await supabase.from("managers").select("id, employee_id, department_id");
      if (error) {
        setError("Error fetching managers.");
        console.error(error);
      } else {
        setManagers(data);
      }
    };
    fetchManagers();
  }, []);

  // Handle form submission to assign manager to department
  const handleAssignManager = async () => {
    if (!selectedManager || !selectedDepartment) {
      setError("Please select a department and manager.");
      return;
    }

    setLoading(true);
    try {
      // Update the department to assign the selected manager
      const { error: deptError } = await supabase
        .from("departments")
        .update({ manager_id: selectedManager }) // Set the manager_id field in the departments table
        .match({ id: selectedDepartment });

      if (deptError) {
        throw new Error(`Error updating department with manager_id: ${deptError.message}`);
      }

      setLoading(false);
      alert("Manager assigned successfully!");
      setSelectedManager(null); // Reset form after successful submission
      setSelectedDepartment(""); // Reset selected department
    } catch (error) {
      setLoading(false);
      setError(error.message || "Error assigning manager.");
      console.error("Error in handleAssignManager:", error); // Log the full error
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Assign Manager to Department</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Department selection */}
      <div className="mb-4">
        <label className="block font-medium">Select Department:</label>
        <select
          className="mt-2 p-2 border border-gray-300"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">-- Select a Department --</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Manager selection */}
      {selectedDepartment && (
        <div className="mb-4">
          <label className="block font-medium">Select Manager:</label>
          <select
            className="mt-2 p-2 border border-gray-300"
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
          >
            <option value="">-- Select a Manager --</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                Manager ID: {manager.id} (Employee ID: {manager.employee_id})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Assign Manager button */}
      <div className="mb-4">
        <button
          onClick={handleAssignManager}
          className="p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Manager"}
        </button>
      </div>
    </div>
  );
};

export default AssignManagerComponent;

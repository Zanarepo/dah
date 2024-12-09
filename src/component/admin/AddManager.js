import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AddManager = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search query for employee
  const [employees, setEmployees] = useState([]); // List of employees matching search query
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee
  const [role, setRole] = useState(""); // Role for the selected employee
  const [error, setError] = useState(""); // Error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  // Fetch employees based on the search query
  useEffect(() => {
    const fetchEmployees = async () => {
      if (searchQuery.length > 0) {
        try {
          // Consolidated query for search
          const { data, error } = await supabase
            .from("employee_profiles")
            .select(
              "employee_id, first_name, last_name, department_id, ministry_id"
            )
            .or(
              `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`
            );

          if (error) {
            throw error;
          }

          setEmployees(data || []);
        } catch (err) {
          console.error(err);
          setError("An error occurred while searching for employees.");
        }
      } else {
        setEmployees([]); // Clear results when search query is empty
      }
    };

    fetchEmployees();
  }, [searchQuery]);

  // Handle adding the selected employee to the managers table
  const handleAddManager = async () => {
    setError("");
    setSuccessMessage("");

    if (!selectedEmployee) {
      setError("Please select an employee.");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      return;
    }

    if (!selectedEmployee.department_id || !selectedEmployee.ministry_id) {
      setError(
        "The selected employee does not have a valid department or ministry assigned."
      );
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      return;
    }

    if (!role) {
      setError("Please select a role for the manager.");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      const { error } = await supabase.from("managers").insert([{
        employee_id: selectedEmployee.employee_id,
        department_id: selectedEmployee.department_id,
        ministry_id: selectedEmployee.ministry_id,
        role: role,
      }]);

      if (error) {
        throw error;
      }

      setSuccessMessage("Manager added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
      setSelectedEmployee(null);
      setRole("");
      setSearchQuery(""); // Clear search query
      setEmployees([]);
    } catch (err) {
      console.error(err);
      setError("Error adding manager: " + err.message);
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Manager</h1>

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

      {/* Employee Search */}
      <div className="mb-6">
        <label htmlFor="searchQuery" className="block text-sm font-medium mb-2 text-gray-600">
          Search Employee
        </label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by employee name"
        />
        {employees.length > 0 && (
          <ul className="mt-2 bg-white border rounded-md shadow-md max-h-48 overflow-auto">
            {employees.map((employee) => (
              <li
                key={employee.employee_id}
                onClick={() => setSelectedEmployee(employee)}
                className={`cursor-pointer p-3 hover:bg-gray-200 ${
                  selectedEmployee?.employee_id === employee.employee_id
                    ? "bg-gray-200"
                    : ""
                }`}
              >
                {employee.first_name} {employee.last_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Employee */}
      {selectedEmployee && (
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700">Selected Employee</h2>
          <p className="text-sm text-gray-600">
            <strong>Name:</strong> {selectedEmployee.first_name}{" "}
            {selectedEmployee.last_name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Department ID:</strong> {selectedEmployee.department_id}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Ministry ID:</strong> {selectedEmployee.ministry_id}
          </p>

          {/* Role Dropdown */}
          <div className="mt-4">
            <label htmlFor="role" className="block text-sm font-medium mb-2 text-gray-600">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Role --</option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Secretary">Secretary</option>
              {/* Add other roles as needed */}
            </select>
          </div>
        </div>
      )}

      {/* Add Manager Button */}
      <button
        onClick={handleAddManager}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-6 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Manager
      </button>
    </div>
  );
};

export default AddManager;

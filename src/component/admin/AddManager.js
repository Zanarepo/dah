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
      return;
    }

    if (!selectedEmployee.department_id || !selectedEmployee.ministry_id) {
      setError(
        "The selected employee does not have a valid department or ministry assigned."
      );
      return;
    }

    if (!role) {
      setError("Please select a role for the manager.");
      return;
    }

    try {
      const { error } = await supabase.from("managers").insert([
        {
          employee_id: selectedEmployee.employee_id,
          department_id: selectedEmployee.department_id,
          ministry_id: selectedEmployee.ministry_id,
          role: role,
        },
      ]);

      if (error) {
        throw error;
      }

      setSuccessMessage("Manager added successfully!");
      setSelectedEmployee(null);
      setRole("");
      setSearchQuery(""); // Clear search query
      setEmployees([]);
    } catch (err) {
      console.error(err);
      setError("Error adding manager: " + err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Manager</h1>

      {/* Employee Search */}
      <div className="mb-4">
        <label htmlFor="searchQuery" className="block">
          Search Employee
        </label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-1 w-full"
          placeholder="Search by employee name"
        />
        {employees.length > 0 && (
          <ul className="mt-2 bg-white border rounded-md shadow-md">
            {employees.map((employee) => (
              <li
                key={employee.employee_id}
                onClick={() => setSelectedEmployee(employee)}
                className={`cursor-pointer p-2 hover:bg-gray-200 ${
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

      {/* Error or Success Message */}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Selected Employee */}
      {selectedEmployee && (
        <div className="mb-4">
          <h2 className="text-xl font-medium">Selected Employee</h2>
          <p>
            <strong>Name:</strong> {selectedEmployee.first_name}{" "}
            {selectedEmployee.last_name}
          </p>
          <p>
            <strong>Department ID:</strong> {selectedEmployee.department_id}
          </p>
          <p>
            <strong>Ministry ID:</strong> {selectedEmployee.ministry_id}
          </p>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label htmlFor="role" className="block">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-1"
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
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Add Manager
      </button>
    </div>
  );
};

export default AddManager;

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
          // Fetch employees by first name, last name, department, or ministry
          const queries = [
            supabase.from("employee_profiles").select("employee_id, first_name, last_name, department_id, ministry_id")
              .ilike("first_name", `%${searchQuery}%`),
            supabase.from("employee_profiles").select("employee_id, first_name, last_name, department_id, ministry_id")
              .ilike("last_name", `%${searchQuery}%`),
            supabase.from("employee_profiles").select("employee_id, first_name, last_name, department_id, ministry_id")
              .ilike("department", `%${searchQuery}%`),
            supabase.from("employee_profiles").select("employee_id, first_name, last_name, department_id, ministry_id")
              .ilike("ministry", `%${searchQuery}%`),
          ];

          // Execute all queries concurrently
          const results = await Promise.all(queries);

          // Combine and remove duplicates based on employee_id
          const allEmployees = results.flatMap((result) => result.data || []);
          const uniqueEmployees = [
            ...new Map(allEmployees.map((item) => [item.employee_id, item])).values(),
          ];

          setEmployees(uniqueEmployees); // Set the combined list of employees
        } catch (error) {
          console.error(error);
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
    if (!selectedEmployee || !role) {
      setError("Please select an employee and a role.");
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
        setError("Error adding manager.");
        console.error(error);
      } else {
        setSuccessMessage("Manager added successfully!");
        setSelectedEmployee(null);
        setRole("");
        setSearchQuery(""); // Clear search query
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Manager</h1>

      {/* Employee Search */}
      <div className="mb-4">
        <label htmlFor="searchQuery" className="block">Search Employee</label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-1 w-full"
          placeholder="Search by employee name, department, or ministry"
        />
        {employees.length > 0 && (
          <ul className="mt-2 bg-white border rounded-md shadow-md">
            {employees.map((employee) => (
              <li
                key={employee.employee_id}
                onClick={() => setSelectedEmployee(employee)}
                className="cursor-pointer p-2 hover:bg-gray-200"
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
            {selectedEmployee.first_name} {selectedEmployee.last_name}
          </p>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label htmlFor="role" className="block">Select Role</label>
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

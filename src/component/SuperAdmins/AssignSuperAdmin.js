import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";

const AssignSuperAdmin = () => {
  const [employees, setEmployees] = useState([]); // List of employees
  const [ministries, setMinistries] = useState([]); // List of ministries
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee
  const [selectedMinistry, setSelectedMinistry] = useState(null); // Selected ministry
  const [message, setMessage] = useState(""); // Message for popups
  const [messageType, setMessageType] = useState(""); // Message type for success/error

  useEffect(() => {
    // Fetch employees and ministries on component mount
    fetchEmployees();
    fetchMinistries();
  }, []);

  // Fetch the list of employees from employee_profiles
  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("employee_profiles")
      .select("employee_id, first_name, last_name");

    if (error) {
      console.error("Error fetching employees:", error);
    } else {
      setEmployees(data);
    }
  };

  // Fetch the list of ministries from the ministries table
  const fetchMinistries = async () => {
    const { data, error } = await supabase
      .from("ministries")
      .select("id, name");

    if (error) {
      console.error("Error fetching ministries:", error);
    } else {
      setMinistries(data);
    }
  };

  // Assign an employee as a super admin
  const assignSuperAdmin = async () => {
    if (!selectedEmployee || !selectedMinistry) {
      setMessageType("error");
      setMessage("Please select both an employee and a ministry.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      return;
    }

    try {
      // Insert into super_admin table with auto-generated UUID
      const { error: insertError } = await supabase
        .from("super_admin")
        .insert({
          employee_id: selectedEmployee,
          ministry_id: selectedMinistry,
        });

      if (insertError) throw insertError;

      // Update is_super_admin in employee_profiles table
      const { error: updateError } = await supabase
        .from("employee_profiles")
        .update({ is_super_admin: true })
        .eq("employee_id", selectedEmployee);

      if (updateError) throw updateError;

      // Success: Show success message
      setMessageType("success");
      setMessage("Super admin assigned successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds

      // Optionally, refresh the employees list
      fetchEmployees();
    } catch (err) {
      console.error("Error assigning super admin:", err.message);
      setMessageType("error");
      setMessage("An error occurred while assigning the super admin.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <div className="assign-super-admin-container p-6 bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex flex-col items-center">
      {/* Title */}
      <h2 className="text-3xl font-bold text-white mb-6">Assign Super Admin</h2>
      <p className="text-lg text-white text-center mb-6">Select an employee and a ministry to assign as super admin.</p>

      {/* Dropdown for selecting employee */}
      <div className="mb-4">
        <label htmlFor="employee" className="text-white">Select Employee</label>
        <select
          id="employee"
          className="p-2 rounded-md w-full mt-2"
          value={selectedEmployee || ""}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">--Select an Employee--</option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown for selecting ministry */}
      <div className="mb-4">
        <label htmlFor="ministry" className="text-white">Select Ministry</label>
        <select
          id="ministry"
          className="p-2 rounded-md w-full mt-2"
          value={selectedMinistry || ""}
          onChange={(e) => setSelectedMinistry(e.target.value)}
        >
          <option value="">--Select a Ministry--</option>
          {ministries.map((ministry) => (
            <option key={ministry.id} value={ministry.id}>
              {ministry.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button to assign super admin */}
      <button
        onClick={assignSuperAdmin}
        className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition"
      >
        Assign Super Admin
      </button>

      {/* Popup message */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-md ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AssignSuperAdmin;

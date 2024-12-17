import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";




const DepartmentAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch departments on component load
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from("departments")
          .select("id, name");
        if (error) throw error;
        setDepartments(data || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setErrorMessage("Failed to fetch departments.");
      }
    };

    fetchDepartments();
  }, []);

  // Fetch employees when a department is selected
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedDepartment) return;
      try {
        const { data, error } = await supabase
          .from("employee_profiles")
          .select("employee_id, first_name, last_name")
          .eq("department_id", selectedDepartment);
        if (error) throw error;
        setEmployees(data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setErrorMessage("Failed to fetch employees.");
      }
    };

    fetchEmployees();
  }, [selectedDepartment]);

  // Assign an employee as a department admin
  const assignAdmin = async () => {
    if (!selectedEmployee || !selectedDepartment) {
      setErrorMessage("Please select a department and an employee.");
      return;
    }

    try {
      const {  error } = await supabase.from("department_admins").insert([
        {
          employee_id: selectedEmployee.employee_id,
          department_id: selectedDepartment,
        },
      ]);

      if (error) throw error;

      setSuccessMessage(
        `${selectedEmployee.first_name} ${selectedEmployee.last_name} has been assigned as the admin for the selected department.`
      );
      setErrorMessage("");
      setSelectedEmployee(null);
      setEmployees([]);
    } catch (err) {
      console.error("Error assigning department admin:", err);
      setErrorMessage("Failed to assign department admin.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Assign Department Admin</h2>

      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      {/* Department Dropdown */}
      <div className="mb-4">
        <label htmlFor="department" className="block mb-2">
          Select Department
        </label>
        <select
          id="department"
          value={selectedDepartment || ""}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select Department --</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Dropdown */}
      {selectedDepartment && (
        <div className="mb-4">
          <label htmlFor="employee" className="block mb-2">
            Select Employee
          </label>
          <select
            id="employee"
            value={selectedEmployee?.employee_id || ""}
            onChange={(e) => {
              const employeeId = e.target.value;
              const employee = employees.find(
                (emp) => emp.employee_id.toString() === employeeId
              );
              setSelectedEmployee(employee || null);
            }}
            className="border p-2 w-full"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((employee) => (
              <option key={employee.employee_id} value={employee.employee_id}>
                {employee.first_name} {employee.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={assignAdmin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={!selectedEmployee}
      >
        Assign Admin
      </button>
    </div>
  );
};

export default DepartmentAdmin;

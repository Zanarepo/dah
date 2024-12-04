import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ManageDepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Initialize as an empty string

  // Fetch departments and managers from the respective tables
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

    const fetchManagers = async () => {
      // Fetch manager_ids for all departments
      const { data: departmentsData, error: departmentError } = await supabase
        .from("departments")
        .select("id, manager_id");

      if (departmentError) {
        setError("Error fetching departments.");
        console.error(departmentError);
      } else {
        // For each department, fetch manager data from the 'managers' table
        const managerIds = departmentsData
          .map(department => department.manager_id)
          .filter(id => id); // Only fetch non-null manager_ids

        if (managerIds.length > 0) {
          const { data: managersData, error: managersError } = await supabase
            .from("managers")
            .select("id, employee_id") // Get manager id and employee_id from managers table
            .in("id", managerIds); // Fetch matching managers by id

          if (managersError) {
            setError("Error fetching managers.");
            console.error(managersError);
          } else {
            // Now use employee_id from managers table to fetch employee details
            const employeeIds = managersData.map(manager => manager.employee_id);
            const { data: employeeProfiles, error: employeeError } = await supabase
              .from("employee_profiles")
              .select("employee_id, first_name, last_name")
              .in("employee_id", employeeIds);

            if (employeeError) {
              setError("Error fetching employee profiles for managers.");
              console.error(employeeError);
            } else {
              setManagers(employeeProfiles); // Store manager employee profiles
            }
          }
        }
      }
    };

    fetchDepartments();
    fetchManagers();
  }, []);

  // Remove manager from department
  const handleRemoveManager = async () => {
    if (!selectedDepartment) {
      setError("Please select a department.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("departments")
      .update({ manager_id: null }) // Set manager_id to null
      .match({ id: selectedDepartment });

    setLoading(false);

    if (error) {
      setError("Error removing manager.");
      console.error(error);
    } else {
      alert("Manager removed successfully!");
      setSelectedDepartment(null); // Reset form after successful submission
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Department Manager</h1>

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

      {/* Display departments with managers */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Departments and Managers</h2>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Department Name</th>
              <th className="px-4 py-2">Manager</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => {
              // Find the corresponding manager for the department
              const managerId = department.manager_id;
              const manager = managers.find(
                (manager) => manager.employee_id === managerId
              );

              return (
                <tr key={department.id}>
                  <td className="border px-4 py-2">{department.name}</td>
                  <td className="border px-4 py-2">
                    {manager
                      ? `${manager.first_name} ${manager.last_name}`
                      : "No Manager Assigned"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Remove Manager button */}
      <div className="mb-4">
        <button
          onClick={handleRemoveManager}
          className="p-2 bg-red-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Removing..." : "Remove Manager"}
        </button>
      </div>
    </div>
  );
};

export default ManageDepartmentManager;

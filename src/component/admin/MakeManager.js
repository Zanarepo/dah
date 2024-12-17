import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AddEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      // Fetch employees from employee_profiles
      const { data: employeeData, error: employeeError } = await supabase
        .from("employee_profiles")
        .select("employee_id, first_name, last_name, department_id, email, phone_number");
  
      if (employeeError) {
        setError("Error fetching employees.");
        console.error(employeeError);
      } else {
        setEmployees(employeeData);
      }
  
      // Fetch managers from managers table, and get their first_name and last_name from employee_profiles
      const { data: managerData, error: managerError } = await supabase
        .from("managers")
        .select("id, employee_id, employee_profiles!managers_employee_id_fkey (first_name, last_name)");  // Use the correct foreign key here
  
      if (managerError) {
        setError("Error fetching managers.");
        console.error(managerError);
      } else {
        setManagers(managerData);
      }
    };
  
    fetchData();
  }, []);
  

  // Handle employee selection for submitting
  const handleCheckboxChange = (employee_id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employee_id)
        ? prevSelected.filter((id) => id !== employee_id) // Remove from selection
        : [...prevSelected, employee_id] // Add to selection
    );
  };

  // Handle manager selection for an employee
  const handleManagerChange = (employee_id, manager_id) => {
    setSelectedManagers((prevManagers) => ({
      ...prevManagers,
      [employee_id]: manager_id,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      setError("Please select at least one employee.");
      return;
    }

    // Ensure all selected employees have a manager assigned
    const employeesWithoutManager = selectedEmployees.filter(
      (employee_id) => !selectedManagers[employee_id]
    );

    if (employeesWithoutManager.length > 0) {
      setError("Please assign a manager to all selected employees.");
      return;
    }

    try {
      // Ensure all required fields are filled (first_name, last_name, email, phone_number, etc.)
      const selectedData = employees
        .filter((emp) => selectedEmployees.includes(emp.employee_id))
        .map((employee) => ({
          employee_id: employee.employee_id,
          first_name: employee.first_name || "N/A", // Default value if not provided
          last_name: employee.last_name || "N/A",   // Default value if not provided
          email: employee.email || `${employee.employee_id}@example.com`, // Default email if not provided
          phone_number: employee.phone_number || "1234567890", // Default phone number if not provided
          manager_id: selectedManagers[employee.employee_id],
          department_id: employee.department_id || null, // Default to null if not provided
          ministry_id: employee.ministry_id || null,     // Default to null if not provided
          // Add any additional fields that are required by your table schema
          date_of_birth: employee.date_of_birth || null,
          marital_status: employee.marital_status || null,
          sex: employee.sex || null,
          nationality: employee.nationality || null,
          state_of_origin: employee.state_of_origin || null,
          lga_of_origin: employee.lga_of_origin || null,
          employment_date: employee.employment_date || new Date().toISOString(), // Default to current date
          employment_type: employee.employment_type || "FT", // Default to full-time
          position: employee.position || "Employee", // Default position
          grade_level: employee.grade_level || "Level 1", // Default grade level
          qualification: employee.qualification || "N/A", // Default qualification
          step: employee.step || 1, // Default step in grade
          annual_leave: employee.annual_leave || 21, // Default annual leave days
          years_in_service: employee.years_in_service || 0, // Default years in service
          retirement_date: employee.retirement_date || null, // Default to null
          profile_picture: employee.profile_picture || null, // Default to null
          password: employee.password || "password123", // Default password (to be updated by user)
          pre_filled_by_admin: true, // Mark as pre-filled by admin
          updated_by_employee: false, // Mark as not updated by employee yet
        }));

      // Update employee_profiles with the selected managers and required fields
      const { error } = await supabase
        .from("employee_profiles")
        .upsert(selectedData, { onConflict: ["employee_id"] });

      if (error) {
        setError("Error saving employee data.");
        console.error(error);
      } else {
        setSuccessMessage("Employees successfully updated with managers!");
        setSelectedEmployees([]); // Reset the selected employees
        setSelectedManagers({}); // Reset the selected managers
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assign Managers to Employees</h1>
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

              {/* Manager Dropdown for selected employee */}
              {selectedEmployees.includes(employee.employee_id) && (
                <div className="ml-4">
                  <label htmlFor={`manager-${employee.employee_id}`} className="block">
                    Select Manager
                  </label>
                  <select
                    id={`manager-${employee.employee_id}`}
                    onChange={(e) =>
                      handleManagerChange(employee.employee_id, e.target.value)
                    }
                    className="border p-1"
                  >
                    <option value="">-- Select Manager --</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.employee_profiles?.first_name} {manager.employee_profiles?.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Submit Selected Employees
      </button>
    </div>
  );
};

export default AddEmployees;

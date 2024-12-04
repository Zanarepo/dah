import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const EmployeeEmploymentDetails = ({ employeeData, setEmployeeData }) => {
  const [ministries, setMinistries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  // Fetch ministries on component mount
  useEffect(() => {
    const fetchMinistries = async () => {
      const { data, error } = await supabase.from("ministries").select("id, name");
      if (error) {
        console.error("Error fetching ministries:", error.message);
      } else {
        setMinistries(data);
      }
    };

    fetchMinistries();
  }, []);

  // Fetch departments when ministry is selected
  useEffect(() => {
    if (employeeData.ministry_id) {
      const fetchDepartments = async () => {
        const { data, error } = await supabase
          .from("departments")
          .select("id, name")
          .eq("ministry_id", employeeData.ministry_id);

        if (error) {
          console.error("Error fetching departments:", error.message);
        } else {
          setDepartments(data);
        }
      };

      fetchDepartments();
    }
  }, [employeeData.ministry_id]);

  // Fetch managers when department is selected
  useEffect(() => {
    if (employeeData.department_id) {
      const fetchManagers = async () => {
        const { data, error } = await supabase
          .from("employee_profiles") // Assuming employee_profiles table contains manager data
          .select("id, first_name, last_name") // Selecting first_name, last_name for managers
          .eq("department_id", employeeData.department_id); // Filtering by department_id

        if (error) {
          console.error("Error fetching managers:", error.message);
        } else {
          setManagers(data); // Storing managers data
        }
      };

      fetchManagers();
    }
  }, [employeeData.department_id]);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save employee data to Supabase
  const saveEmployeeData = async () => {
    const { error } = await supabase
      .from("employee_details") // Assuming the table where employment details are stored
      .upsert([
        {
          employee_id: employeeData.employee_id, // Assuming employee_id is in employeeData
          employment_date: employeeData.employment_date,
          employment_type: employeeData.employment_type,
          ministry_id: employeeData.ministry_id,
          department_id: employeeData.department_id,
          manager: employeeData.manager,
          position: employeeData.position,
          grade_level: employeeData.grade_level,
          step: employeeData.step,
          qualification: employeeData.qualification,
        },
      ]);
    if (error) {
      console.error("Error saving employee data:", error.message);
    } else {
      alert("Employee details saved successfully!");
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Employment Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="employment_date" className="block text-sm font-medium">
            Employment Date
          </label>
          <input
            type="date"
            id="employment_date"
            name="employment_date"
            value={employeeData.employment_date}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="employment_type" className="block text-sm font-medium">
            Employment Type
          </label>
          <select
            id="employment_type"
            name="employment_type"
            value={employeeData.employment_type}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select</option>
            <option value="Contract">Contract</option>
            <option value="FT">Full-Time</option>
          </select>
        </div>

        {/* Ministry Dropdown */}
        <div>
          <label htmlFor="ministry_id" className="block text-sm font-medium">
            Ministry
          </label>
          <select
            id="ministry_id"
            name="ministry_id"
            value={employeeData.ministry_id || ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Ministry</option>
            {ministries.map((ministry) => (
              <option key={ministry.id} value={ministry.id}>
                {ministry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department Dropdown */}
        <div>
          <label htmlFor="department_id" className="block text-sm font-medium">
            Department
          </label>
          <select
            id="department_id"
            name="department_id"
            value={employeeData.department_id || ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manager Dropdown */}
        <div>
          <label htmlFor="manager" className="block text-sm font-medium">
            Manager
          </label>
          <select
            id="manager"
            name="manager"
            value={employeeData.manager || ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.first_name} {manager.last_name} {/* Showing manager's first and last name */}
              </option>
            ))}
          </select>
        </div>

        {/* Other input fields */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={employeeData.position}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="grade_level" className="block text-sm font-medium">
            Grade Level
          </label>
          <input
            type="text"
            id="grade_level"
            name="grade_level"
            value={employeeData.grade_level}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="step" className="block text-sm font-medium">
            Step
          </label>
          <input
            type="text"
            id="step"
            name="step"
            value={employeeData.step}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="qualification" className="block text-sm font-medium">
            Qualification
          </label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={employeeData.qualification}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={saveEmployeeData}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EmployeeEmploymentDetails;

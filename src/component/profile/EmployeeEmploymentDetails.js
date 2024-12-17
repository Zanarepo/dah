import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeEmploymentDetails = ({ employeeData, setEmployeeData }) => {
  const [ministries, setMinistries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMinistries = async () => {
      const { data, error } = await supabase.from("ministries").select("id, name");
      if (error) {
        toast.error("Error fetching ministries.");
      } else {
        setMinistries(data);
      }
    };

    fetchMinistries();
  }, []);

  useEffect(() => {
    if (employeeData.ministry_id) {
      const fetchDepartments = async () => {
        const { data, error } = await supabase
          .from("departments")
          .select("id, name")
          .eq("ministry_id", employeeData.ministry_id);

        if (error) {
          toast.error("Error fetching departments.");
        } else {
          setDepartments(data);
        }
      };

      fetchDepartments();
    }
  }, [employeeData.ministry_id]);

  useEffect(() => {
    if (employeeData.department_id) {
      const fetchManagers = async () => {
        const { data, error } = await supabase
          .from("employee_profiles")
          .select("id, first_name, last_name")
          .eq("department_id", employeeData.department_id);

        if (error) {
          toast.error("Error fetching managers.");
        } else {
          setManagers(data);
        }
      };

      fetchManagers();
    }
  }, [employeeData.department_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveEmployeeData = async () => {
    setLoading(true);
  
    const {  error } = await supabase
      .from("employee_profiles")
      .upsert(
        [
          {
            employee_id: employeeData.employee_id, // Ensures the record with the employee_id is updated
            employment_date: employeeData.employment_date,
            employment_type: employeeData.employment_type,
            ministry_id: employeeData.ministry_id,
            department_id: employeeData.department_id,
            position: employeeData.position,
            qualification: employeeData.qualification,
          },
        ],
        { onConflict: ['employee_id'] } // This makes sure the existing employee record is updated
      );
  
    setLoading(false);
  
    if (error) {
      toast.error("Error saving employee details.");
    } else {
      toast.success("Employee details saved successfully!");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-sm rounded-xl border border-gray-200">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center space-x-3">
        <span className="material-icons-outlined text-blue-500">Work</span>
        <span>Employment Details</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employment Date */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          <label
            htmlFor="employment_date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Employment Date
          </label>
          <input
            type="date"
            id="employment_date"
            name="employment_date"
            value={employeeData.employment_date}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Employment Type */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          <select
            id="employment_type"
            name="employment_type"
            value={employeeData.employment_type}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="">Select</option>
            <option value="Contract">Contract</option>
            <option value="FT">Full-Time</option>
          </select>
        </div>

        {/* Ministry */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          <label htmlFor="ministry_id" className="block text-sm font-medium text-gray-700 mb-2">
            Ministry
          </label>
          <select
            id="ministry_id"
            name="ministry_id"
            value={employeeData.ministry_id || ""}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="">Select Ministry</option>
            {ministries.map((ministry) => (
              <option key={ministry.id} value={ministry.id}>
                {ministry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            id="department_id"
            name="department_id"
            value={employeeData.department_id || ""}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manager */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-2">
            Manager
          </label>
          <select
            id="manager"
            name="manager"
            value={employeeData.manager || ""}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.first_name} {manager.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Position */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={employeeData.position}
            onChange={handleChange}
            placeholder="Enter position"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Qualification */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
            Qualification
          </label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={employeeData.qualification}
            onChange={handleChange}
            placeholder="Enter qualification"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center">
        <button
          onClick={saveEmployeeData}
          disabled={loading}
          className={`w-1/2 py-3 px-6 rounded-md text-white ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default EmployeeEmploymentDetails;

// src/components/EmployeeEmploymentDetails.js
import React from "react";

const EmployeeEmploymentDetails = ({ employeeData, setEmployeeData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Employment Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="employment_date" className="block text-sm font-medium">Employment Date</label>
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
          <label htmlFor="employment_type" className="block text-sm font-medium">Employment Type</label>
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

        <div>
          <label htmlFor="department" className="block text-sm font-medium">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={employeeData.department}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium">Position</label>
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
          <label htmlFor="grade_level" className="block text-sm font-medium">Grade Level</label>
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
          <label htmlFor="step" className="block text-sm font-medium">Step</label>
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
          <label htmlFor="manager" className="block text-sm font-medium">Manager</label>
          <input
            type="text"
            id="manager"
            name="manager"
            value={employeeData.manager}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="qualification" className="block text-sm font-medium">Qualification</label>
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
    </div>
  );
};

export default EmployeeEmploymentDetails;

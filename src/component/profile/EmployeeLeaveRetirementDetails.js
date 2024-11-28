// src/components/EmployeeLeaveRetirementDetails.js
import React from "react";

const EmployeeLeaveRetirementDetails = ({ employeeData, setEmployeeData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Leave and Retirement Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="annual_leave" className="block text-sm font-medium">
            Annual Leave (Days)
          </label>
          <input
            type="number"
            id="annual_leave"
            name="annual_leave"
            value={employeeData.annual_leave}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="years_in_service" className="block text-sm font-medium">
            Years in Service
          </label>
          <input
            type="number"
            id="years_in_service"
            name="years_in_service"
            value={employeeData.years_in_service}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="retirement_date" className="block text-sm font-medium">
            Retirement Date
          </label>
          <input
            type="date"
            id="retirement_date"
            name="retirement_date"
            value={employeeData.retirement_date}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveRetirementDetails;

// src/components/EmployeePersonalDetails.js
import React, { useState } from "react";

const EmployeePersonalDetails = ({ employeeData, setEmployeeData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="employee_id" className="block text-sm font-medium">Employee ID</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={employeeData.employee_id}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="first_name" className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={employeeData.first_name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={employeeData.last_name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={employeeData.date_of_birth}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={employeeData.phone_number}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={employeeData.address}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="marital_status" className="block text-sm font-medium">Marital Status</label>
          <select
            id="marital_status"
            name="marital_status"
            value={employeeData.marital_status}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
          </select>
        </div>

        <div>
          <label htmlFor="sex" className="block text-sm font-medium">Sex</label>
          <select
            id="sex"
            name="sex"
            value={employeeData.sex}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="nationality" className="block text-sm font-medium">Nationality</label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={employeeData.nationality}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="state_of_origin" className="block text-sm font-medium">State of Origin</label>
          <input
            type="text"
            id="state_of_origin"
            name="state_of_origin"
            value={employeeData.state_of_origin}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="lga_of_origin" className="block text-sm font-medium">LGA of Origin</label>
          <input
            type="text"
            id="lga_of_origin"
            name="lga_of_origin"
            value={employeeData.lga_of_origin}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeePersonalDetails;

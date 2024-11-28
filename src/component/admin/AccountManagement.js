import React, { useState } from "react";
import { supabase } from "../../supabaseClient"; // Import Supabase client
import './EmployeeForm.css';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    employmentDate: "",
    employmentType: "contract", // Default value
    department: "",
    position: "",
    gradeLevel: "",
    manager: "",
    annualLeave: 0,
    yearsInService: 0,
    retirementDate: "",
    temporaryPassword: "",
    contactMethod: "whatsapp", // Default option
    contactInfo: "", // WhatsApp number or email
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save employee data to Supabase
      const { data, error } = await supabase.from("employee_details").insert([
        {
          employee_id: formData.employeeId,
          employment_date: formData.employmentDate,
          employment_type: formData.employmentType,
          annual_leave: formData.annualLeave,
          department: formData.department,
          years_in_service: formData.yearsInService,
          retirement: formData.retirementDate || null,
          position: formData.position,
          grade_level: formData.gradeLevel,
          manager: formData.manager,
        },
      ]);

      if (error) throw error;

      // Success message and share the link
      setMessage(
        `Employee account created! Link has been shared via ${
          formData.contactMethod
        } (${formData.contactInfo})`
      );

      // Sharing logic placeholder (WhatsApp/Email integration)
      console.log(
        `Share via ${formData.contactMethod}: Temporary login details for Employee ID: ${formData.employeeId}`
      );
    } catch (err) {
      console.error(err);
      setMessage("Error creating the employee record. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin: Pre-fill Employee Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        {/* Employee ID */}
        <div>
          <label className="block mb-2 font-semibold">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Employment Date */}
        <div>
          <label className="block mb-2 font-semibold">Employment Date</label>
          <input
            type="date"
            name="employmentDate"
            value={formData.employmentDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Employment Type */}
        <div>
          <label className="block mb-2 font-semibold">Employment Type</label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="contract">Contract</option>
            <option value="FT">Full Time</option>
          </select>
        </div>

        {/* Other Key Fields */}
        <div>
          <label className="block mb-2 font-semibold">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Temporary Password */}
        <div>
          <label className="block mb-2 font-semibold">Temporary Password</label>
          <input
            type="text"
            name="temporaryPassword"
            value={formData.temporaryPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Contact Method */}
        <div>
          <label className="block mb-2 font-semibold">Share Via</label>
          <select
            name="contactMethod"
            value={formData.contactMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Contact Info */}
        <div>
          <label className="block mb-2 font-semibold">
            {formData.contactMethod === "whatsapp"
              ? "WhatsApp Number"
              : "Email Address"}
          </label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Create and Share Link
        </button>
      </form>

      {/* Status Message */}
      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
};

export default AdminPanel;

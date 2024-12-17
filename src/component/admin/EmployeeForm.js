import React, { useState } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you have configured Supabase client

const EmployeeRegistrationForm = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    department: "",
    position: "",
    employment_date: "",
    temporary_password: "",
    shared_via: "WhatsApp", // Default set to WhatsApp
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employee_id, first_name, last_name, email, phone_number, department, position, employment_date, temporary_password, shared_via } = formData;

    if (!employee_id || !first_name || !last_name || !email || !phone_number || !department || !position || !employment_date) {
      setError("Please fill in all fields.");
      return;
    }

    // Reset success and error messages
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    // Insert form data into the `employee_registration` table in Supabase
    try {
      const { error } = await supabase.from("employee_registration").insert([
        {
          employee_id,
          first_name,
          last_name,
          email,
          phone_number,
          department,
          position,
          employment_date,
          temporary_password,
          shared_via,
        },
      ]);

      if (error) {
        // Handle specific unique constraint errors
        if (error.code === "23505") {  // Unique violation error code
          if (error.message.includes("email")) {
            setError("Email already exists.");
          } else if (error.message.includes("phone_number")) {
            setError("Phone number already in use.");
          } else if (error.message.includes("employee_id")) {
            setError("Employee ID already in use.");
          } else {
            setError("An error occurred. Please check the details and try again.");
          }
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
        setTimeout(() => {
          setError(null); // Hide message after 3 seconds
        }, 5000);
        return;
      }

      setSuccessMessage(" Registration  successfully!");
      setTimeout(() => {
        setSuccessMessage(null); // Hide message after 3 seconds
      }, 5000);

      setFormData({
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        department: "",
        position: "",
        employment_date: "",
        temporary_password: "",
        shared_via: "WhatsApp",
      });
    } catch (error) {
      console.error("Error inserting registration data:", error);
      setError("An unexpected error occurred. Please try again later.");
      setTimeout(() => {
        setError(null); // Hide message after 3 seconds
      }, 3000);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Employee Registration</h2>

      {/* Error message */}
      {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

      {/* Success message */}
      {successMessage && <div className="bg-green-500 text-white p-2 rounded mb-4">{successMessage}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-1/2 p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-1/2 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="Employee ID"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Position"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="date"
            name="employment_date"
            value={formData.employment_date}
            onChange={handleChange}
            placeholder="Employment Date"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="temporary_password"
            value={formData.temporary_password}
            onChange={handleChange}
            placeholder="Temporary Password"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <div>
            <label htmlFor="shared_via" className="block text-sm">Shared Via</label>
            <select
              id="shared_via"
              name="shared_via"
              value={formData.shared_via}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Registering..." : "Register Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeRegistrationForm;

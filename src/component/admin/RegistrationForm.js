import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { supabase } from "../../supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeRegistrationForm = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    employment_date: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    employment_date: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    let validationErrors = {};
    
    if (!formData.first_name) validationErrors.first_name = "First name is required.";
    if (!formData.last_name) validationErrors.last_name = "Last name is required.";
    if (!formData.email) validationErrors.email = "Email is required.";
    if (!formData.phone_number) validationErrors.phone_number = "Phone number is required.";
    if (!formData.employment_date) validationErrors.employment_date = "Employment date is required.";
    if (!formData.password) validationErrors.password = "Password is required.";

    setError(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submitting
    if (!validateForm()) return;

    const { employee_id, first_name, last_name, email, phone_number, employment_date, password } = formData;
    const generatedEmployeeId = employee_id || uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    setLoading(true);
    setError({});  // Clear previous errors

    try {
      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from("employee_profiles")
        .select("email")
        .eq("email", email);

      if (existingEmail && existingEmail.length > 0) {
        toast.error("Email already exists. Please use a different email.");
        setLoading(false);
        return;
      }

      // Check if Employee ID already exists
      const { data: existingEmployeeId } = await supabase
        .from("employee_profiles")
        .select("employee_id")
        .eq("employee_id", generatedEmployeeId);

      if (existingEmployeeId && existingEmployeeId.length > 0) {
        toast.error("Employee ID already exists. Please use a unique ID.");
        setLoading(false);
        return;
      }

      // Insert new employee record
      const { error: regError } = await supabase.from("employee_profiles").insert([
        {
          employee_id: generatedEmployeeId,
          first_name,
          last_name,
          email,
          phone_number,
          employment_date,
          password: hashedPassword,
        },
      ]);

      if (regError) {
        toast.error("Registration failed. Please try again later.");
        setLoading(false);
        return;
      }

      setFormData({
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        employment_date: "",
        password: "",
      });

      setLoading(false);
      toast.success("Employee registered successfully!");
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md md:my-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Employee Registration</h2>

      {/* Display error messages */}
      {Object.values(error).length > 0 && (
        <div className="text-red-600 mb-4">
          <ul>
            {Object.entries(error).map(([key, errMsg]) => (
              <li key={key} className="text-sm">{errMsg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Employee ID */}
        <div className="mb-4">
          <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
            Employee ID
          </label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Input Your Unique ID Here"
          />
          {error.employee_id && <p className="text-red-500 text-sm">{error.employee_id}</p>}
        </div>

        {/* First Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {error.first_name && <p className="text-red-500 text-sm">{error.first_name}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {error.last_name && <p className="text-red-500 text-sm">{error.last_name}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {error.phone_number && <p className="text-red-500 text-sm">{error.phone_number}</p>}
        </div>

        {/* Employment Date */}
        <div className="mb-4">
          <label htmlFor="employment_date" className="block text-sm font-medium text-gray-700">
            Employment Date
          </label>
          <input
            type="date"
            id="employment_date"
            name="employment_date"
            value={formData.employment_date}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {error.employment_date && <p className="text-red-500 text-sm">{error.employment_date}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? "Registering..." : "Register Employee"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EmployeeRegistrationForm;

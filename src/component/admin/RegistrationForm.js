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
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      employee_id,
      first_name,
      last_name,
      email,
      phone_number,
      employment_date,
      password,
    } = formData;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !employment_date ||
      !password
    ) {
      toast.error("All fields are required. Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const generatedEmployeeId = employee_id || uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if email or Employee ID already exists
      const { data: existingEmail } = await supabase
        .from("employee_profiles")
        .select("email")
        .eq("email", email);

      if (existingEmail && existingEmail.length > 0) {
        toast.error("Email already exists. Please use a different email.");
        setLoading(false);
        return;
      }

      const { data: existingEmployeeId } = await supabase
        .from("employee_profiles")
        .select("employee_id")
        .eq("employee_id", generatedEmployeeId);

      if (existingEmployeeId && existingEmployeeId.length > 0) {
        toast.error("Employee ID already exists. Please use a unique ID.");
        setLoading(false);
        return;
      }

      // Insert new employee
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
      
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
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
        </div>

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
              required
            />
          </div>

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
              required
            />
          </div>
        </div>

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
            required
          />
        </div>

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
            required
          />
        </div>

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
            required
          />
        </div>

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
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-gray-500"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EmployeeRegistrationForm;

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { supabase } from "../../supabaseClient";

const EmployeeRegistrationForm = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    //department: "",
    //position: "",
    //step: "",
    //manager: "",
    employment_date: "", // Added employment date
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
      //department,
      //position,
      //step,
      //manager,
      employment_date, // Destructure employment date
      password,
    } = formData;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
     // !department ||
      //!position ||
      //!step ||
      //!manager ||
      !employment_date || // Check if employment date is filled
      !password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate a unique employee_id if not provided
      const generatedEmployeeId = employee_id || uuidv4();

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the record into the database
      const { data, error: regError } = await supabase
        .from("employee_profiles")
        .insert([
          {
            employee_id: generatedEmployeeId,
            first_name,
            last_name,
            email,
            phone_number,
            //department,
            //position,
           // step,
            //manager,
            employment_date, // Include employment date in the insert
            password: hashedPassword,
          },
        ]);

      if (regError) {
        setError(regError.message);
        setLoading(false);
        return;
      }

      // Success, clear form data
      setFormData({
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
       // department: "",
        //position: "",
       //manager: "",
        employment_date: "", // Clear employment date
        password: "",
      });
      setLoading(false);
      alert("Employee registration successful");
    } catch (error) {
      setError("An error occurred while registering.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Employee Registration</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="employee_id"
            className="block text-sm font-medium text-gray-700"
          >
            Employee ID (Optional)
          </label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Auto-generated if left blank"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700"
          >
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

        <div className="mb-4">
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
          >
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

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700"
          >
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

         {/*

        <div className="mb-4">
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700"
          >
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="step"
            className="block text-sm font-medium text-gray-700"
          >
            Step
          </label>
          <input
            type="text"
            id="step"
            name="step"
            value={formData.step}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

       */ }

        <div className="mb-4">
          <label
            htmlFor="employment_date"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
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

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeRegistrationForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { supabase } from "../../supabaseClient";
import bcrypt from "bcryptjs";

const LoginForm = () => {
  const [formData, setFormData] = useState({ employee_id: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" }); // For pop-up messages
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);
  
    const { employee_id, password } = formData;
  
    try {
      // Fetch the user from the employee_profiles table
      const { data: user, error: fetchError } = await supabase
        .from("employee_profiles")
        .select("employee_id, password, is_admin")
        .eq("employee_id", employee_id)
        .single();
  
      if (fetchError || !user) {
        setMessage({ text: "Invalid Employee ID or password.", type: "error" });
        setLoading(false);
        return;
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        setMessage({ text: "Invalid Employee ID or password.", type: "error" });
        setLoading(false);
        return;
      }
  
      // Save employee_id in localStorage for session persistence
      localStorage.setItem("employee_id", employee_id);
  
      // Dual-role check
      if (user.is_admin) {
        // Check if the user is both an admin and an employee
        const { data: employeeCheck } = await supabase
          .from("employee_profiles")
          .select("*")
          .eq("employee_id", employee_id)
          .single();
  
        if (employeeCheck && user.is_admin) {
          navigate("/role-selection"); // Redirect to role selection page
          return;
        }
        // If user is only an admin
        navigate("/admin");
      } else {
        // If user is only an employee
        navigate("/profile");
      }
  
      setMessage({ text: "Login successful!", type: "success" });
      setLoading(false);
    } catch (err) {
      console.error("Login error:", err.message);
      setMessage({ text: "An unexpected error occurred. Please try again.", type: "error" });
      setLoading(false);
    }
  };
  
  // Navigate to Forgot Password Page
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow-md rounded relative">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {/* Pop-up Message */}
      {message.text && (
        <div
          className={`absolute top-4 right-4 p-3 rounded ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="employee_id" className="block text-sm font-medium">
            Employee ID
          </label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Forgot Password Link */}
      <div className="mt-4 text-center">
        <button
          onClick={handleForgotPassword}
          className="text-blue-500 hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

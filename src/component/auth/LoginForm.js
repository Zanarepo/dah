import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import bcrypt from "bcryptjs";

const LoginForm = () => {
  const [formData, setFormData] = useState({ employee_id: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const { data: user, error } = await supabase
        .from("employee_profiles")
        .select("employee_id, password, is_admin, admin_ministry, is_super_admin")
        .eq("employee_id", employee_id)
        .single();

      if (error || !user) {
        setMessage({ text: "Invalid Employee ID or password.", type: "error" });
        setLoading(false);
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        setMessage({ text: "Invalid Employee ID or password.", type: "error" });
        setLoading(false);
        return;
      }

      localStorage.setItem("employee_id", employee_id);
      // Storing user details and session in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      const roles = [];
      if (user.is_super_admin) roles.push({ name: "Super Admin", route: "/superadmins" });
      if (user.admin_ministry) roles.push({ name: "Admin Ministry", route: "/adminministry" });
      if (user.is_admin) roles.push({ name: "Admin", route: "/admindashboard" });
      roles.push({ name: "Employee", route: "/profiles" });

      if (roles.length === 1) {
        navigate(roles[0].route);
      } else {
        navigate("/role-selection", { state: { roles } });
      }

      setMessage({ text: "Login successful!", type: "success" });
      setLoading(false);
    } catch (err) {
      console.error("Login error:", err.message);
      setMessage({ text: "An unexpected error occurred. Please try again.", type: "error" });
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow-md rounded relative">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

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

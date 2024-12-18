import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import bcrypt from "bcryptjs";
import NotificationModal from "../profile/NotificationModal"; // Import the NotificationModal

const LoginForm = () => {
  const [formData, setFormData] = useState({ employee_id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(""); // Message for modal
  const [modalType, setModalType] = useState("error"); // Modal type (success/error)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { employee_id, password } = formData;

    try {
      // Attempt to fetch user data from Supabase
      const { data: user, error } = await supabase
        .from("employee_profiles")
        .select("employee_id, password, is_admin, admin_ministry, is_super_admin")
        .eq("employee_id", employee_id)
        .single();

      if (error || !user) {
        setModalMessage("Invalid Employee ID or password.");
        setModalType("error");
        setModalOpen(true); // Open error modal
        setLoading(false);
        setTimeout(() => setModalOpen(false), 3000); // Close modal after 3 seconds
        return;
      }

      // Check if password is correct using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        setModalMessage("Invalid Employee ID or password.");
        setModalType("error");
        setModalOpen(true); // Open error modal
        setLoading(false);
        setTimeout(() => setModalOpen(false), 3000); // Close modal after 3 seconds
        return;
      }

      // Store user details and session in localStorage
      localStorage.setItem("employee_id", employee_id);
      localStorage.setItem("user", JSON.stringify(user));

      const roles = [];
      if (user.is_super_admin) roles.push({ name: "Super Admin", route: "/superadmins" });
      if (user.admin_ministry) roles.push({ name: "Admin Ministry", route: "/adminministry" });
      if (user.is_admin) roles.push({ name: "Admin", route: "/admindashboard" });
      roles.push({ name: "Employee", route: "/personal-details" });

      // Navigate based on user roles
      if (roles.length === 1) {
        navigate(roles[0].route);
      } else {
        navigate("/role-selection", { state: { roles } });
      }

      setLoading(false);
      setModalMessage("Login Successful!");
      setModalType("success");
      setModalOpen(true); // Open success modal
      setTimeout(() => setModalOpen(false), 3000); // Close modal after 3 seconds
    } catch (err) {
      console.error("Login error:", err.message);
      setModalMessage("An unexpected error occurred. Please try again.");
      setModalType("error");
      setModalOpen(true); // Open error modal
      setLoading(false);
      setTimeout(() => setModalOpen(false), 3000); // Close modal after 3 seconds
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-600">
              Employee ID
            </label>
            <input
              type="text"
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V2a10 10 0 00-10 10h2z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-blue-500 hover:underline text-sm"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Notification Modal */}
      {modalOpen && (
        <NotificationModal 
          message={modalMessage}
          type={modalType} // Pass the type (success/error)
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default LoginForm;

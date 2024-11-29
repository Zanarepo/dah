import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve email from state

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Update password in `employee_logins`
      const { error } = await supabase
        .from("employee_logins")
        .update({ password: newPassword, is_temporary_password: false })
        .eq("email", state.email);

      if (error) {
        setError("Failed to reset password. Try again.");
        return;
      }

      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

        <div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;

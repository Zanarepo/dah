import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("token"); // Get token from URL

  useEffect(() => {
    if (!accessToken) {
      setMessage({ text: "Invalid or expired token.", type: "error" });
    }
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!password || !confirmPassword) {
      setMessage({ text: "Both password fields are required.", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    try {
      // Reset the password
      const { error } = await supabase.auth.api.updateUser(accessToken, { password });

      if (error) {
        setMessage({ text: "Error resetting password. Please try again.", type: "error" });
        return;
      }

      setMessage({ text: "Password successfully updated.", type: "success" });
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      console.error("Error:", err.message);
      setMessage({ text: "An unexpected error occurred. Please try again.", type: "error" });
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      {message.text && (
        <div className={`p-3 rounded ${message.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

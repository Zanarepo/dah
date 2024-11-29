import React, { useState } from "react";
import { supabase } from "../../supabaseClient"; // Adjust according to your setup

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!email) {
        setMessage("Please enter an email address.");
        setLoading(false);
        return;
      }

      // Log the email to verify
      console.log("Attempting password reset for email:", email);

      // Use the correct resetPasswordForEmail method
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setMessage(`Error: ${error.message}`);
        console.error("Supabase Error:", error); // Log the error for debugging
        setLoading(false);
        return;
      }

      setMessage("Password reset link sent! Please check your email.");
      setLoading(false);
    } catch (err) {
      console.error("Error:", err.message);
      setMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow-md rounded relative">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      {message && (
        <div
          className={`absolute top-4 right-4 p-3 rounded ${
            message.includes("error") ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

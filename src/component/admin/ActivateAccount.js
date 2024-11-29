import React, { useState } from "react";
import { supabase } from "../../supabaseClient"; // Import Supabase client
import { useNavigate, useSearchParams } from "react-router-dom"; // React Router hooks

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Retrieve token from query string
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleActivation = async (e) => {
    e.preventDefault();

    try {
      // Fetch the employee record using the activation token
      const { data, error } = await supabase
        .from("employee_registration")
        .select("*")
        .eq("activation_token", token)
        .single();

      if (error || !data) {
        setMessage("Invalid or expired activation link.");
        return;
      }

      // Insert data into `employee_logins` and hash the password (optional)
      const { email } = data;

      const { error: loginError } = await supabase.from("employee_logins").insert([
        {
          email,
          temporary_password: newPassword,
          is_temporary_password: false,
          is_active: true,
        },
      ]);

      if (loginError) {
        setMessage("Failed to activate account. Please try again.");
        return;
      }

      // Update the registration table to indicate activation
      await supabase
        .from("employee_registration")
        .update({ registration_completed: true })
        .eq("activation_token", token);

      setMessage("Account activated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setMessage("An error occurred during activation. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Activate Account</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleActivation} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 rounded bg-blue-600 text-white"
        >
          Activate Account
        </button>
      </form>
    </div>
  );
};

export default ActivateAccount;

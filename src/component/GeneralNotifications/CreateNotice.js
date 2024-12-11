import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const CreateNotice = ({ refreshNotifications }) => {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const handleCreateNotice = async () => {
    if (!type || !message || !employeeId) {
      alert("All fields are required.");
      return;
    }

    const { error } = await supabase.from("general_notifications").insert([
      {
        employee_id: parseInt(employeeId, 10),
        type,
        message,
      },
    ]);

    if (error) {
      console.error("Error creating notification:", error);
    } else {
      alert("Notification created successfully!");
      setType("");
      setMessage("");
      setEmployeeId("");
      refreshNotifications();
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Create Notification</h3>
      <div className="space-y-2">
        <input
          type="text"
          className="w-full border p-2 rounded-md"
          placeholder="Type (e.g., Leave Request)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="text"
          className="w-full border p-2 rounded-md"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="number"
          className="w-full border p-2 rounded-md"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md"
          onClick={handleCreateNotice}
        >
          Create Notice
        </button>
      </div>
    </div>
  );
};

export default CreateNotice;

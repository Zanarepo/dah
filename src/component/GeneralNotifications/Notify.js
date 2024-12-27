import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Ensure this is correct
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeNotificationCenter = () => {
  const [newNotificationMessage, setNewNotificationMessage] = useState("");
  const [notificationTopic, setNotificationTopic] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [senderDetails, setSenderDetails] = useState({});

  // Fetch sender details
  useEffect(() => {
    const fetchSenderDetails = async () => {
      const storedUserId = localStorage.getItem("employee_id");

      if (!storedUserId) {
        toast.error("User is not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("employee_profiles")
        .select("employee_id, first_name, last_name, department_id, ministry_id")
        .eq("employee_id", storedUserId)
        .single();

      if (error) {
        toast.error("Failed to fetch sender details");
        return;
      }

      setSenderDetails({
        employee_id: data.employee_id,
        name: `${data.first_name} ${data.last_name}`,
        department_id: data.department_id,
        ministry_id: data.ministry_id,
      });
    };

    fetchSenderDetails();
  }, []);

  // Add new notification
  const createNotification = async () => {
    if (!notificationType || !newNotificationMessage) {
      toast.error("Please provide all required information");
      return;
    }

    try {
      toast.info("Creating notification...");

      const { error } = await supabase
        .from("general_notifications")
        .insert([
          {
            employee_id: senderDetails.employee_id,
            ministry_id: senderDetails.ministry_id,
            department_id: senderDetails.department_id,
            sender_id: senderDetails.employee_id,
            type: notificationType,
            message: newNotificationMessage,
          },
        ]);

      if (error) throw new Error("Error creating notification");

      toast.success("Notification sent successfully!");
      setNewNotificationMessage("");
      setNotificationTopic("");
      setNotificationType("");
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">Send Notification</h2>

        {/* Dropdown for notification type */}
        <select
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">Select Notification Type</option>
          <option value="Emergency">Emergency</option>
          <option value="Appointment Reminder">Appointment Reminder</option>
          <option value="Leave Approval">Leave Approval</option>
          <option value="Meeting Reminder">Meeting Reminder</option>
        </select>

        <input
          type="text"
          value={notificationTopic}
          onChange={(e) => setNotificationTopic(e.target.value)}
          placeholder="Enter notification topic"
          className="w-full p-2 border rounded-md mb-4"
        />
        <textarea
          value={newNotificationMessage}
          onChange={(e) => setNewNotificationMessage(e.target.value)}
          placeholder="Enter notification message"
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
        ></textarea>
        <button
          onClick={createNotification}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition w-full"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default EmployeeNotificationCenter;

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Ensure this is correct
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBell, FaPlus } from "react-icons/fa";

const EmployeeNotificationCenter = () => {
  const [newNotificationMessage, setNewNotificationMessage] = useState("");
  const [notificationTopic, setNotificationTopic] = useState("");
  const [senderDetails, setSenderDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        .select("first_name, last_name, department_id")
        .eq("employee_id", storedUserId)
        .single();

      if (error) {
        console.error("Error fetching sender details:", error);
        toast.error("Failed to fetch sender details");
        return;
      }

      setSenderDetails({
        name: `${data.first_name} ${data.last_name}`,
        department_id: data.department_id,
      });
    };

    fetchSenderDetails();
  }, []);

  // Add new notification
  const createNotification = async () => {
    if (!notificationTopic.trim() || !newNotificationMessage.trim()) {
      toast.error("Both notification topic and message are required");
      return;
    }

    try {
      const storedUserId = localStorage.getItem("employee_id");

      if (!storedUserId) {
        toast.error("User is not authenticated");
        return;
      }

      // Fetch admin for the sender's department
      const { data: adminData, error: adminError } = await supabase
        .from("access_level")
        .select("employee_id")
        .eq("department_id", senderDetails.department_id)
        .eq("access_id", 2) // Assuming access_id 2 corresponds to department admin
        .single();

      if (adminError || !adminData) {
        console.error("Error fetching department admin:", adminError);
        toast.error("Failed to find the appropriate admin");
        return;
      }

      const adminId = adminData.employee_id;

      const { error } = await supabase
        .from("general_notifications")
        .insert([
          {
            employee_id: adminId,
            sender_id: storedUserId,
            sender_name: senderDetails.name,
            department_id: senderDetails.department_id,
            topic: notificationTopic,
            message: newNotificationMessage,
            type: "General",
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error("Error creating notification:", error);
        toast.error("Failed to create notification");
        return;
      }

      toast.success("Notification sent successfully!");
      setNewNotificationMessage("");
      setNotificationTopic("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <ToastContainer />

      {/* Floating Add Notification Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <FaBell className="mr-2" />
        <FaPlus />
      </button>

      {/* Modal for adding notifications */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Notification</h2>
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
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full text-center text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeNotificationCenter;


import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newNotificationMessage, setNewNotificationMessage] = useState("");

  // Fetch notifications
  const fetchNotifications = async () => {
    const storedUserId = localStorage.getItem("employee_id");

    if (!storedUserId) {
      toast.error("User is not authenticated");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("general_notifications")
        .select("id, message, is_read, created_at")
        .eq("employee_id", storedUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Error fetching notifications");
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Error fetching notifications");
    }
  };

  // Create a new notification
  const createNotification = async () => {
    if (!newNotificationMessage.trim()) {
      toast.error("Notification message cannot be empty");
      return;
    }

    const storedUserId = localStorage.getItem("employee_id");

    if (!storedUserId) {
      toast.error("User is not authenticated");
      return;
    }

    try {
      const { error } = await supabase
        .from("general_notifications")
        .insert([
          {
            employee_id: storedUserId,
            message: newNotificationMessage,
            type: "Reminder",
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error("Error creating notification:", error);
        toast.error("Error creating notification");
        return;
      }

      toast.success("Notification created successfully!");
      setNewNotificationMessage("");
      setShowModal(false);
      fetchNotifications(); // Refresh the notifications
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Error creating notification");
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("general_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Error marking notification as read");
        return;
      }

      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error marking notification as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6 relative">
      <h1 className="text-xl font-bold mb-4">Your Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-gray-500">No notifications available</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg ${
                notification.is_read ? "bg-gray-100" : "bg-white"
              }`}
            >
              <p>{notification.message}</p>
              <div className="text-sm text-gray-500">
                {new Date(notification.created_at).toLocaleString()}
              </div>
              <button
                onClick={() => markAsRead(notification.id)}
                className="mt-2 text-blue-500 hover:underline"
              >
                {notification.is_read ? "Already read" : "Mark as read"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create Notification</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Enter your notification message"
              value={newNotificationMessage}
              onChange={(e) => setNewNotificationMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={createNotification}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeNotificationCenter;

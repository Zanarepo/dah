import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Ensure this is correct
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";

const EmployeeNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotificationMessage, setNewNotificationMessage] = useState("");
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const storedUserId = localStorage.getItem("employee_id");

      if (!storedUserId) {
        setError("User is not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("general_notifications")
        .select("id, message, is_read, created_at")
        .eq("employee_id", storedUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        setError("Error fetching notifications");
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Error fetching notifications");
    }
  };

  // Add new notification
  const createNotification = async () => {
    if (!newNotificationMessage.trim()) {
      toast.error("Notification message cannot be empty");
      return;
    }

    try {
      const storedUserId = localStorage.getItem("employee_id");

      if (!storedUserId) {
        toast.error("User is not authenticated");
        return;
      }

      const { error } = await supabase
        .from("general_notifications")
        .insert([
          {
            employee_id: storedUserId,
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

      toast.success("Notification created successfully!");
      setNewNotificationMessage("");
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  // Mark as read
  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from("general_notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Failed to mark notification as read");
        return;
      }

      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  // Clear all notifications
  const clearNotifications = async () => {
    try {
      const storedUserId = localStorage.getItem("employee_id");

      if (!storedUserId) {
        toast.error("User is not authenticated");
        return;
      }

      const { error } = await supabase
        .from("general_notifications")
        .delete()
        .eq("employee_id", storedUserId);

      if (error) {
        console.error("Error clearing notifications:", error);
        toast.error("Failed to clear notifications");
        return;
      }

      toast.success("All notifications cleared!");
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <ToastContainer />

      {/* Header and Clear Notifications */}
<div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
  <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left mb-4 sm:mb-0">
    Your Notifications
  </h1>
  <button
    onClick={clearNotifications}
    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition w-full sm:w-auto"
  >
    <FaTrash className="inline-block mr-2" />
    Notifications
  </button>
</div>


      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* New Notification Input */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <input
          type="text"
          value={newNotificationMessage}
          onChange={(e) => setNewNotificationMessage(e.target.value)}
          placeholder="Enter notification message"
          className="flex-grow p-2 border rounded-md text-sm sm:text-base"
        />
        <button
          onClick={createNotification}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
        >
          Add Notification
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-gray-500">No notifications available</div>
      ) : (
        <div className="space-y-4">
          {/* Separate unread and read notifications */}
          {notifications
            .sort((a, b) => a.is_read - b.is_read) // Unread notifications come first
            .map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  notification.is_read ? 'bg-gray-100' : 'bg-blue-100'
                }`}
              >
                <p className="font-medium text-sm sm:text-base">{notification.message}</p>
                <div className="text-xs sm:text-sm text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </div>
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 text-blue-500 hover:underline text-xs sm:text-sm"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default EmployeeNotificationCenter;

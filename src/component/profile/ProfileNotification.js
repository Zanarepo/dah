import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Ensure the import is correct


const EmployeeNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotificationMessage, setNewNotificationMessage] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null); // Store the userId dynamically
  const [isAdmin, setIsAdmin] = useState(null); // Track the admin status

  // Fetch employee notifications
  const fetchNotifications = async () => {
    const storedUserId = localStorage.getItem("employee_id");

    if (!storedUserId) {
      setError("User is not authenticated");
      return;
    }

    try {
      // Fetch employee profile to check if the user is an admin
      const { data: profileData, error: profileError } = await supabase
        .from("employee_profiles")
        .select("employee_id, is_admin")
        .eq("employee_id", storedUserId)  // Use employee_id to query
        .single(); // Get single row (one employee)

      if (profileError || !profileData) {
        setError("User profile not found or error fetching profile");
        return;
      }

      setIsAdmin(profileData.is_admin);

      // Fetch notifications for the logged-in employee
      const { data, error: fetchError } = await supabase
        .from("general_notifications")
        .select("id, message, is_read, created_at")
        .eq("employee_id", storedUserId) // Use employee_id from localStorage
        .order("created_at", { ascending: false }); // Sort by creation date

      if (fetchError) {
        console.error("Error fetching notifications:", fetchError);
        setError("Error fetching notifications");
        return;
      }

      if (!data || data.length === 0) {
        setError("No notifications found for this employee");
        return;
      }

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Error fetching notifications");
    }
  };

  // Create a reminder notification
  const createReminderNotification = async () => {
    if (!newNotificationMessage) {
      setError("Notification message cannot be empty");
      return;
    }

    const storedUserId = localStorage.getItem("employee_id");

    if (!storedUserId) {
      setError("User is not authenticated");
      return;
    }

    try {
      const { error: insertError } = await supabase
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

      if (insertError) {
        console.error("Error creating notification:", insertError);
        setError("Error creating notification");
        return;
      }

      // Clear input and update notification list
      setNewNotificationMessage("");
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error creating notification:", error);
      setError("Error creating notification");
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    const storedUserId = localStorage.getItem("employee_id");

    if (!storedUserId) {
      setError("User is not authenticated");
      return;
    }

    try {
      const { error } = await supabase
        .from("general_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Error marking notification as read:", error);
        setError("Error marking notification as read");
        return;
      }

      // Refresh notifications after marking as read
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Error marking notification as read");
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      {error && <div className="text-red-500">{error}</div>}

      <h1 className="text-xl font-bold mb-4">Your Notifications</h1>

      {isAdmin !== null && (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-gray-500">No notifications available</div>
          ) : (
            notifications.map((notification) => (
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
            ))
          )}
        </div>
      )}

      <div className="mt-6">
        <input
          type="text"
          value={newNotificationMessage}
          onChange={(e) => setNewNotificationMessage(e.target.value)}
          placeholder="Enter a reminder message"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={createReminderNotification}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Create Reminder Notification
        </button>
      </div>
    </div>
  );
};

export default EmployeeNotificationCenter;

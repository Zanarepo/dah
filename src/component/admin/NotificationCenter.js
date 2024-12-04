import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const NotificationCenter = ({ adminId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications for the admin
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("admin_id", adminId) // Admin ID to filter notifications
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [adminId]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const { error } = await supabase
      .from("notifications")
      .update({ status: "read" })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error.message);
    } else {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: "read" }
            : notification
        )
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold">Notification Center</h2>
      <div className="mt-4">
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 rounded-md border ${
                  notification.status === "unread" ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{notification.type}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2">{notification.message}</p>
                {notification.status === "unread" && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Mark as Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;

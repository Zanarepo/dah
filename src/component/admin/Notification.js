import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; 
import { FaBell } from "react-icons/fa"; 
import "./Notification.css";

const Notifications = ({ user_id, isManager = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Fetch notifications for employee or manager based on user_id
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq(isManager ? "employee_id" : "admin_id", user_id) // Check if it's a manager or employee
          .order("created_at", { ascending: false });

        if (error) {
          setError(error.message);
          console.error("Error fetching notifications:", error);
        } else {
          setNotifications(data);
          setUnreadCount(data.filter((notif) => notif.status === "unread").length);
        }
      } catch (err) {
        setError("Failed to fetch notifications.");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchNotifications();
    }
  }, [user_id, isManager]);

  const handleMarkAsRead = async (notification_id) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ status: "read", updated_at: new Date() })
        .eq("id", notification_id);

      if (error) throw error;

      // Update state to remove the read notification
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notification_id ? { ...notif, status: "read" } : notif
        )
      );
      
      // Update unread count
      setUnreadCount((prevCount) => prevCount - 1);

    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="notifications-container">
      <div className="notifications-icon-container">
        <FaBell className="notification-icon" />
        {unreadCount > 0 && (
          <span className="unread-count">{unreadCount}</span>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification ${notification.status}`}
              >
                <div>{notification.message}</div>
                <span className="notification-type">{notification.notification_type}</span>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={notification.status === "read"}
                  className="mark-as-read-button"
                >
                  {notification.status === "read" ? "Read" : "Mark as Read"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;

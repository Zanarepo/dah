import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import MarkNotice from "./MarkNotice";

const GeneralNotificationCentre = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications based on user role
  const fetchNotifications = async () => {
    try {
      const employeeId = localStorage.getItem("employee_id"); // Get logged-in user's employee ID
      if (!employeeId) {
        console.error("User not logged in.");
        setNotifications([]);
        return;
      }

      // Fetch user's access level
      const { data: accessLevelData, error: accessError } = await supabase
        .from("access_level")
        .select("access_id, ministry_id, department_id")
        .eq("employee_id", employeeId)
        .single();

      if (accessError || !accessLevelData) {
        console.error("Error fetching access level:", accessError?.message);
        setNotifications([]);
        return;
      }

      const { access_id, ministry_id, department_id } = accessLevelData;

      // Build query based on user's role
      let query = supabase
        .from("general_notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (access_id === 1) {
        // is_admin: Fetch notifications for their specific department
        query = query.eq("department_id", department_id);
      } else if (access_id === 2) {
        // admin_ministry: Fetch notifications for all departments in their ministry
        query = query.eq("ministry_id", ministry_id);
      }
      // access_id === 3 (super_admin): Fetch all notifications (no filters needed)

      // Execute query
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching notifications:", error.message);
        setNotifications([]);
      } else {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setNotifications([]);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Notification Centre</h2>
      
      <div className="mt-6">
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notice) => (
              <li
                key={notice.id}
                className={`flex justify-between items-center p-4 border rounded-md ${
                  notice.is_read ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <div>
                  <p className="text-lg font-medium">{notice.type}</p>
                  <p className="text-gray-600">{notice.message}</p>
                  <p className="text-sm text-gray-400">{new Date(notice.created_at).toLocaleString()}</p>
                </div>
                <MarkNotice
                  id={notice.id}
                  isRead={notice.is_read}
                  refreshNotifications={fetchNotifications} // Use the fetchNotifications function to refresh
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default GeneralNotificationCentre;

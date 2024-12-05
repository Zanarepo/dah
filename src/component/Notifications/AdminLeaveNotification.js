import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const AdminLeaveNotification = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Fetch initial notifications
    fetchNewLeaveRequests();

    // Set up real-time subscription
    const subscription = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "employee_leave" },
        () => {
          setNotificationCount((prev) => prev + 1);
        }
      )
      .subscribe();

    // Cleanup on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchNewLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("employee_leave")
        .select("*")
        .eq("status", "Pending");

      if (error) throw error;

      setNotificationCount(data.length);
    } catch (err) {
      console.error("Error fetching leave requests:", err.message);
    }
  };

  return (
    <div className="relative">
      <Link to="/leave-notification" className="relative bg-gray-200 rounded-full p-2">
        <span className="text-lg font-bold">🔔</span>
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2">
            {notificationCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default AdminLeaveNotification;

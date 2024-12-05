import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const LeaveTracker = () => {
  const [leaveStats, setLeaveStats] = useState({
    approved: 0,
    pending: 0,
    expired: 0,
    rejected: 0,
    active: 0,
  });

  useEffect(() => {
    const fetchLeaveStats = async () => {
      try {
        // Fetch data from the employee_leave table
        const { data, error } = await supabase
          .from("employee_leave")
          .select("id, leave_type, start_date, end_date, status");

        if (error) throw error;

        // Log fetched data for debugging
        console.log("Fetched leave data:", data);

        // Categorize leaves
        const currentDate = new Date();
        const approvedCount = data.filter((leave) => leave.status.toLowerCase() === "approved").length;
        const pendingCount = data.filter((leave) => leave.status.toLowerCase() === "pending").length;
        const rejectedCount = data.filter((leave) => leave.status.toLowerCase() === "rejected").length;
        const expiredCount = data.filter(
          (leave) =>
            leave.status.toLowerCase() === "approved" && new Date(leave.end_date) < currentDate
        ).length;
        const activeCount = data.filter(
          (leave) =>
            leave.status.toLowerCase() === "approved" &&
            new Date(leave.start_date) <= currentDate &&
            new Date(leave.end_date) >= currentDate
        ).length;

        // Update state
        setLeaveStats({
          approved: approvedCount,
          pending: pendingCount,
          expired: expiredCount,
          rejected: rejectedCount,
          active: activeCount,
        });
      } catch (err) {
        console.error("Error fetching leave stats:", err.message);
      }
    };

    fetchLeaveStats();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
        Leave Tracker
      </h2>

      {/* Leave Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-100 text-center rounded-lg">
          <h4 className="text-lg font-bold">Pending</h4>
          <p className="text-2xl text-blue-700">{leaveStats.pending}</p>
        </div>
        <div className="p-4 bg-green-100 text-center rounded-lg">
          <h4 className="text-lg font-bold">Approved</h4>
          <p className="text-2xl text-green-700">{leaveStats.approved}</p>
        </div>
        <div className="p-4 bg-yellow-100 text-center rounded-lg">
          <h4 className="text-lg font-bold">Active</h4>
          <p className="text-2xl text-yellow-700">{leaveStats.active}</p>
        </div>
        <div className="p-4 bg-red-100 text-center rounded-lg">
          <h4 className="text-lg font-bold">Expired</h4>
          <p className="text-2xl text-red-700">{leaveStats.expired}</p>
        </div>
        <div className="p-4 bg-gray-300 text-center rounded-lg">
          <h4 className="text-lg font-bold">Rejected</h4>
          <p className="text-2xl text-gray-800">{leaveStats.rejected}</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveTracker;

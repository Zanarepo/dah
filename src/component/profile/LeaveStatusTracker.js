import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const LeaveStatusTracker = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

  const fetchLeaveRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("employee_leave")
        .select("id, leave_type, start_date, end_date, status");

      if (error) throw error;

      setLeaveRecords(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave records.");
    }
  };

  const determineStatus = (leave) => {
    const currentDate = new Date();
    const startDate = new Date(leave.start_date);
    const endDate = new Date(leave.end_date);

    if (leave.status === "Rejected") {
      return { label: "Rejected", color: "bg-gray-400" };
    } else if (currentDate < startDate) {
      return { label: "Pending", color: "bg-blue-400" };
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return { label: "Active", color: "bg-green-400" };
    } else if (currentDate > endDate) {
      return { label: "Expired", color: "bg-red-400" };
    }
  };

  return (
    <div className="leave-status-tracker p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Leave Status Tracker</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Leave Type</th>
            <th className="py-2 px-4 border">Start Date</th>
            <th className="py-2 px-4 border">End Date</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRecords.map((leave) => {
            const { label, color } = determineStatus(leave);
            return (
              <tr key={leave.id}>
                <td className="py-2 px-4 border">{leave.leave_type}</td>
                <td className="py-2 px-4 border">{leave.start_date}</td>
                <td className="py-2 px-4 border">{leave.end_date}</td>
                <td className={`py-2 px-4 border ${color} text-white font-semibold`}>
                  {label}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveStatusTracker;

import React, { useState, useEffect } from "react";
import LeaveRequest from "./LeaveRequest";

const LeaveRequestsTab = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch("/api/leave-requests");
      const data = await response.json();
      setLeaveRequests(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Pending Leave Requests</h2>
      {leaveRequests.length > 0 ? (
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <LeaveRequest
              key={request.id}
              request={request}
              fetchLeaveRequests={fetchLeaveRequests} // Refresh the list after action
            />
          ))}
        </div>
      ) : (
        <p>No leave requests found.</p>
      )}
    </div>
  );
};

export default LeaveRequestsTab;

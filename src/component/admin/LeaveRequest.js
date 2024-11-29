import React, { useState } from "react";

const LeaveRequest = ({ request, fetchLeaveRequests }) => {
  const [comment, setComment] = useState("");

  const handleApproval = async () => {
    try {
      await fetch(`/api/approve-leave/${request.id}`, { method: "POST" });
      fetchLeaveRequests(); // Refresh the list
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejection = async () => {
    if (!comment.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    try {
      await fetch(`/api/reject-leave/${request.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      fetchLeaveRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50 shadow-sm">
      <p>
        <strong>Name:</strong> {request.name}
      </p>
      <p>
        <strong>Department:</strong> {request.department}
      </p>
      <p>
        <strong>Leave Type:</strong> {request.leaveType}
      </p>
      <p>
        <strong>Start Date:</strong> {request.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {request.endDate}
      </p>
      <p>
        <strong>Reason:</strong> {request.reason}
      </p>

      {/* Actions */}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleApproval}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Approve
        </button>
        <div>
          <textarea
            placeholder="Reason for rejection (if applicable)"
            className="w-full p-2 border rounded mt-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button
            onClick={handleRejection}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;

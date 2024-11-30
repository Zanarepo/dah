import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you have a Supabase client setup

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const { data, error } = await supabase
          .from("employee_leave")
          .select(`
            id,
            leave_type,
            start_date,
            end_date,
            status,
            leave_type,
            employee_id,
            employee_profiles (first_name, last_name, profile_picture, department, email, phone_number)
          `)
          .eq("status", "Pending")
          .order("start_date", { ascending: true });

        if (error) throw error;

        setLeaveRequests(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leave requests.");
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleApproval = async (requestId) => {
    if (!comments) {
      setError("Please provide comments before submitting the decision.");
      return;
    }

    try {
      setLoading(true);

      // Update the leave request status in employee_leave table
      const { data: leaveData, error: leaveError } = await supabase
        .from("employee_leave")
        .update({ status: status })
        .eq("id", requestId);

      if (leaveError) throw leaveError;

      // Insert approval record into leave_approvals table
      const { data: approvalData, error: approvalError } = await supabase
        .from("leave_approvals")
        .insert([
          {
            leave_request_id: requestId,
            approver_id: 1, // This should be the ID of the logged-in approver
            status: status,
            approval_date: new Date(),
            comments: comments,
          },
        ]);

      if (approvalError) throw approvalError;

      // Immediately remove the approved/rejected request from the leaveRequests state
      setLeaveRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );

      setSuccessMessage("Leave request processed successfully!");
      setStatus("Pending");
      setComments("");
      setLoading(false);

      // Automatically clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error processing leave request:", err);
      setError("Failed to process leave request.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Leave Approvals</h2>

      {loading && <p>Loading pending leave requests...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div>
        {leaveRequests.length === 0 ? (
          <p>No pending leave requests.</p>
        ) : (
          leaveRequests.map((request) => (
            <div key={request.id} className="border p-4 my-2 rounded-md">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-center mb-4">
                {request.employee_profiles ? (
                  <>
                    <img 
                      src={request.employee_profiles.profile_picture} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">
                        {request.employee_profiles.first_name} {request.employee_profiles.last_name}
                      </p>
                      <p>{request.employee_profiles.department}</p>
                      <p>{request.employee_profiles.email}</p>
                      <p>{request.employee_profiles.phone_number}</p>
                    </div>
                  </>
                ) : (
                  <p>No profile available</p>
                )}
              </div>

              {/* Leave Request Info */}
              <p><strong>Leave Type:</strong> {request.leave_type}</p>
              <p><strong>Start Date:</strong> {new Date(request.start_date).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(request.end_date).toLocaleDateString()}</p>

              {/* Approval Status */}
              <div className="my-2">
                <label className="mr-2">Approval Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border p-2 rounded-md"

                >  <option value="Select">--Select--</option>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                  
                </select>
              </div>

              {/* Comments Section */}
              <div className="my-2">
                <label className="mr-2">Comments:</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="border p-2 rounded-md w-full"
                  rows="3"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="my-4">
                <button
                  onClick={() => handleApproval(request.id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
                >
                  Submit
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaveApproval;

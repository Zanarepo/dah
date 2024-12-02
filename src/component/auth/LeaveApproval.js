import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      console.log("Fetching pending leave requests...");
      try {
        const { data, error } = await supabase
          .from("employee_leave")
          .select(`
            id,
            leave_type,
            start_date,
            end_date,
            status,
            employee_id,
            employee_profiles!employee_leave_employee_id_fkey (
              first_name,
              last_name,
              profile_picture,
              department_id,
              email,
              phone_number
            )
          `)
          .eq("status", "Pending")
          .order("start_date", { ascending: true });
  
        if (error) {
          console.error("Error fetching leave requests:", error);
          setError("Failed to fetch leave requests.");
        }
  
        console.log("Fetched leave requests:", data);
        setLeaveRequests(data || []);
      } catch (err) {
        console.error("Exception while fetching leave requests:", err);
        setError("Failed to fetch leave requests.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPendingRequests();
  }, []);
  
  const handleApproval = async (requestId) => {
    if (!comments || status === "Pending") {
      setError("Please provide comments and select a status before submitting.");
      return;
    }

    try {
      setLoading(true);

      // Update leave request status in `employee_leave`
      const { error: leaveError } = await supabase
        .from("employee_leave")
        .update({ status })
        .eq("id", requestId);

      if (leaveError) throw leaveError;

      // Insert approval record into `leave_approvals`
      const { error: approvalError } = await supabase
        .from("leave_approvals")
        .insert([
          {
            leave_request_id: requestId,
            manager_id: 5, // Example manager ID
            department_id: 1, // Example department ID
            status: status,
            approval_date: new Date(),
            comments,
          },
        ]);

      if (approvalError) throw approvalError;

      // Remove processed leave request from state
      setLeaveRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );

      // Show success message
      setSuccessMessage("Leave request processed successfully!");
      setStatus("Pending");
      setComments("");
      setLoading(false);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
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
                        {request.employee_profiles.first_name}{" "}
                        {request.employee_profiles.last_name}
                      </p>
                      <p>Department ID: {request.employee_profiles.department_id}</p>
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
                >
                  <option value="Pending">--Select--</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaveApproval;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const LeaveRequests = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ setSelectedLeave] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [viewingLeave, setViewingLeave] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showArchived, setShowArchived] = useState(false); // Toggle for archive functionality
  const [userAccessLevel, setUserAccessLevel] = useState(null);

  useEffect(() => {
    const fetchAccessLevel = async () => {
      const employeeId = localStorage.getItem('employee_id'); // Get employee ID from localStorage

      const { data, error } = await supabase
        .from('access_level')
        .select('access_id')
        .eq('employee_id', employeeId)
        .single();

      if (error) {
        console.error("Error fetching access level:", error.message);
      } else {
        setUserAccessLevel(data.access_id);
      }
    };

    fetchAccessLevel();
  }, []);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      let query = supabase
        .from("employee_leave")
        .select(
          `id, 
           leave_type, 
           start_date, 
           end_date, 
           status, 
           comment, 
           employee_profiles (
             first_name, 
             last_name
           )`
        );

      // If the user is not a super_admin (access_level !== 3), apply department filter
      if (userAccessLevel !== 3) {
        query = query.eq("department_id", departmentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching leave requests:", error.message);
      } else {
        setLeaveRequests(data);
      }
      setLoading(false);
    };

    if (userAccessLevel !== null) {
      fetchLeaveRequests();
    }
  }, [departmentId, userAccessLevel]);

  const handleApproval = async (leaveId, action) => {
    setLoading(true);
    const { error } = await supabase
      .from("employee_leave")
      .update({ status: action, comment: adminComment })
      .eq("id", leaveId);

    if (error) {
      console.error("Error updating leave status:", error.message);
      setMessage("Failed to update the leave request.");
      setMessageType("error");
    } else {
      setLeaveRequests((prevRequests) =>
        prevRequests.map((leave) =>
          leave.id === leaveId ? { ...leave, status: action, comment: adminComment } : leave
        )
      );
      setMessage("Leave request has been updated successfully.");
      setMessageType("success");
    }

    setTimeout(() => {
      setMessage("");
    }, 3000);

    setLoading(false);
    setSelectedLeave(null);
  };

  const handleViewClick = (leave) => {
    setViewingLeave(leave);
    setAdminComment(""); 
  };

  const handleCollapseView = () => {
    setViewingLeave(null);
  };

  // Filter based on showArchived toggle
  const filteredLeaveRequests = showArchived
    ? leaveRequests
    : leaveRequests.filter((leave) => leave.status === "Pending");

  if (loading) return <p>Loading leave requests...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} 
        className="mb-4 p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Leave Requests</h2>

      {/* Success/Failure Message */}
      {message && (
        <div
          className={`p-4 mb-4 rounded ${
            messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {message}
        </div>
      )}

      {/* Archive Button */}
      <button
        onClick={() => setShowArchived(!showArchived)}
        className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showArchived ? "Show Pending Only" : "Show Archived (Approved & Rejected)"}
      </button>

      {filteredLeaveRequests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Employee Name</th>
              <th className="border border-gray-200 px-4 py-2">Leave Type</th>
              <th className="border border-gray-200 px-4 py-2">Start Date</th>
              <th className="border border-gray-200 px-4 py-2">End Date</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaveRequests.map((leave) => (
              <tr key={leave.id} className={leave.status === "Pending" ? "bg-blue-100" : ""}>
                <td className="border border-gray-200 px-4 py-2">
                  {leave.employee_profiles
                    ? `${leave.employee_profiles.first_name} ${leave.employee_profiles.last_name}`
                    : "Unknown"}
                </td>
                <td className="border border-gray-200 px-4 py-2">{leave.leave_type}</td>
                <td className="border border-gray-200 px-4 py-2">{leave.start_date}</td>
                <td className="border border-gray-200 px-4 py-2">{leave.end_date}</td>
                <td className="border border-gray-200 px-4 py-2">{leave.status}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <button
                    onClick={() => handleViewClick(leave)}
                    className="ml-2 bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No leave requests found for this department.</p>
      )}

      {viewingLeave && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg">Leave Details</h3>
          <p><strong>Employee:</strong> {`${viewingLeave.employee_profiles.first_name} ${viewingLeave.employee_profiles.last_name}`}</p>
          <p><strong>Leave Type:</strong> {viewingLeave.leave_type}</p>
          <p><strong>Start Date:</strong> {viewingLeave.start_date}</p>
          <p><strong>End Date:</strong> {viewingLeave.end_date}</p>
          <p><strong>Status:</strong> {viewingLeave.status}</p>
          <p><strong>Employee Comment:</strong> {viewingLeave.comment || "No comment provided"}</p>

          <textarea
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
            placeholder="Add your comment here..."
            rows="4"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleApproval(viewingLeave.id, "Approved")}
              className="mr-2 bg-green-500 text-white py-1 px-3 rounded"
              disabled={viewingLeave.status === "Approved" || viewingLeave.status === "Rejected"}
            >
              Approve
            </button>
            <button
              onClick={() => handleApproval(viewingLeave.id, "Rejected")}
              className="bg-red-500 text-white py-1 px-3 rounded"
              disabled={viewingLeave.status === "Approved" || viewingLeave.status === "Rejected"}
            >
              Reject
            </button>
          </div>

          <button
            onClick={handleCollapseView}
            className="mt-4 bg-gray-300 text-gray-800 py-1 px-3 rounded"
          >
            Collapse View
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;

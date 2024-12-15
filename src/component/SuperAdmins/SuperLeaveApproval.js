
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const LeaveApprovals = () => {
  const { ministryId } = useParams(); // Assuming you pass ministryId in the URL
  const navigate = useNavigate(); // For back navigation
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("employee_leave")
        .select(
          `id, leave_type, start_date, end_date, status, comment,
           employee_profiles (
             first_name, 
             last_name, 
             department_id,
             departments (name, ministry_id)
           )`
        )
        .eq("status", "Pending"); // Filtering for only 'Pending' status

      if (error) {
        setError("Error fetching leave requests.");
        console.error("Error:", error.message);
      } else {
        // Filter leave requests based on ministryId passed in the URL and department_id
        const filteredData = data.filter(
          (leave) => leave.employee_profiles?.departments?.ministry_id === parseInt(ministryId) &&
            leave.employee_profiles?.departments?.ministry_id === parseInt(ministryId)
        );
        setLeaveRequests(filteredData);
      }

      setLoading(false);
    };

    fetchLeaveRequests();
  }, [ministryId]);

  // Define the handleApproveReject function to update leave status
  const handleApproveReject = async (status, leaveId) => {
    const { error } = await supabase
      .from("employee_leave")
      .update({ status })
      .eq("id", leaveId);

    if (error) {
      setError("Error updating leave status.");
      console.error("Error:", error.message);
    } else {
      setSuccessMessage(`Leave request ${status} successfully.`);
      // Re-fetch leave requests to update the UI
      setLeaveRequests(leaveRequests.filter((leave) => leave.id !== leaveId));
    }
  };

  if (loading) return <p>Loading leave requests...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="mb-4 p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Leave Approvals</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {leaveRequests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Employee Name</th>
              <th className="border border-gray-200 px-4 py-2">Department</th>
              <th className="border border-gray-200 px-4 py-2">Leave Type</th>
              <th className="border border-gray-200 px-4 py-2">Start Date</th>
              <th className="border border-gray-200 px-4 py-2">End Date</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave.id}>
                <td className="border border-gray-200 px-4 py-2">
                  {leave.employee_profiles
                    ? `${leave.employee_profiles.first_name} ${leave.employee_profiles.last_name}`
                    : "Unknown"}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {leave.employee_profiles?.departments?.name || "Unknown"}
                </td>
                <td className="border border-gray-200 px-4 py-2">{leave.leave_type}</td>
                <td className="border border-gray-200 px-4 py-2">{leave.start_date}</td>
                <td className="border border-gray-200 px-4 py-2">{leave.end_date}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <button
                    className="mr-2 bg-green-500 text-white py-1 px-3 rounded"
                    onClick={() => handleApproveReject("Approved", leave.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() => handleApproveReject("Rejected", leave.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No leave requests found for this ministry.</p>
      )}
    </div>
  );
};

export default LeaveApprovals;

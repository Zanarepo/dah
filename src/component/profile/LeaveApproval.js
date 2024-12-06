import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [comment, setComment] = useState("");
  const [expandedLeaveId, setExpandedLeaveId] = useState(null);
  const [error, setError] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("employee_leave")
        .select("id, leave_type, start_date, end_date, status, employee_id, comment")
        .eq("status", "Pending")
        .order("start_date", { ascending: false });

      if (error) throw error;

      setLeaveRequests(data);
    } catch (err) {
      setError("Failed to fetch leave requests.");
      console.error(err);
    }
  };

  const fetchEmployeeDetails = async (employee_id) => {
    try {
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("first_name, last_name, department_id, departments(name)")
        .eq("employee_id", employee_id)
        .single();

      if (error) throw error;

      setEmployeeDetails(data);
    } catch (err) {
      setError("Failed to fetch employee details.");
      console.error(err);
    }
  };

  const handleApproveReject = async (status, leaveId) => {
    if (!comment) {
      setError("Comment is required.");
      return;
    }

    try {
      const { error } = await supabase
        .from("employee_leave")
        .update({ status, comment })
        .eq("id", leaveId);

      if (error) {
        setError("Failed to update leave request.");
        return;
      }

      fetchLeaveRequests();
      setExpandedLeaveId(null);
      setComment("");
      setSuccessMessage(status === "Approved" ? "Leave approved." : "Leave rejected.");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError("An error occurred.");
      console.error(err);
    }
  };

  const toggleRow = (leaveId, employeeId) => {
    if (expandedLeaveId === leaveId) {
      setExpandedLeaveId(null);
      setEmployeeDetails(null);
    } else {
      setExpandedLeaveId(leaveId);
      fetchEmployeeDetails(employeeId);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Leave Approval</h2>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="table-auto w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left">Leave Type</th>
              <th className="py-2 px-4 text-left">Start Date</th>
              <th className="py-2 px-4 text-left">End Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <React.Fragment key={leave.id}>
                <tr
                  className={`border-t ${
                    expandedLeaveId === leave.id ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-2 px-4">{leave.leave_type}</td>
                  <td className="py-2 px-4">{leave.start_date}</td>
                  <td className="py-2 px-4">{leave.end_date}</td>
                  <td className="py-2 px-4">{leave.status}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => toggleRow(leave.id, leave.employee_id)}
                    >
                      {expandedLeaveId === leave.id ? "Collapse" : "Expand"}
                    </button>
                  </td>
                </tr>

                {expandedLeaveId === leave.id && (
                  <tr>
                    <td colSpan={5} className="p-4">
                      <div className="bg-gray-100 rounded-lg p-4">
                        {employeeDetails ? (
                          <>
                            <p>
                              <strong>Employee Name:</strong>{" "}
                              {employeeDetails.first_name}{" "}
                              {employeeDetails.last_name}
                            </p>
                            <p>
                              <strong>Department:</strong>{" "}
                              {employeeDetails.departments?.name || "Unknown"}
                            </p>
                            <p>
                              <strong>Leave Type:</strong> {leave.leave_type}
                            </p>
                            <p>
                              <strong>Start Date:</strong> {leave.start_date}
                            </p>
                            <p>
                              <strong>End Date:</strong> {leave.end_date}
                            </p>
                            <p>
                              <strong>Existing Comment:</strong>{" "}
                              {leave.comment || "No comment provided"}
                            </p>
                          </>
                        ) : (
                          <p>Loading employee details...</p>
                        )}

                        <textarea
                          className="w-full border rounded mt-4 p-2"
                          placeholder="Add a comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                        <div className="flex justify-between mt-4">
                          <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg"
                            onClick={() => handleApproveReject("Approved", leave.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg"
                            onClick={() => handleApproveReject("Rejected", leave.id)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveApproval;

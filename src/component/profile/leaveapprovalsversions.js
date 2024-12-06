//2nd Version

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


//1st Version

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";


// Add the insertLeaveNotification function
const insertLeaveNotification = async (employeeId, leaveRequestId, status) => {
  const message = status === "Approved"
    ? `Your leave request (ID: ${leaveRequestId}) has been approved.`
    : `Your leave request (ID: ${leaveRequestId}) has been rejected.`;

  const { data, error } = await supabase
    .from("notifications")
    .insert([{
      employee_id: employeeId,
      message: message,
      notification_type: "leave",
      status: "unread",
    }]);

  if (error) {
    console.error("Error inserting notification:", error);
  } else {
    console.log("Notification inserted:", data);
  }
};



//const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [error, setError] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const [rejectMessage, setRejectMessage] = useState(null); // State for rejection message

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
      console.error(err);
      setError("Failed to fetch leave requests.");
    }
  };

  const fetchEmployeeDetails = async (employee_id) => {
    try {
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("first_name, last_name, profile_picture, department_id, departments(name)") // Include department name
        .eq("employee_id", employee_id)
        .single();
  
      if (error) throw error;
  
      setEmployeeDetails(data); // Ensure you're using this data to populate the modal
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employee details.");
    }
  };

  const handleApproveReject = async (status) => {
    if (!comment) {
      setError("Comment is required.");
      return;
    }

    try {
      // Update the leave request status (approved/rejected) and add a comment
      const { error } = await supabase
        .from("employee_leave")
        .update({ status, comment })
        .eq("id", selectedLeave.id);

      if (error) {
        setError("Failed to update leave request.");
        console.error(error);
        return;
      }

      // Insert the approval/rejection details into the leave_approval table
      const { error: approvalError } = await supabase
        .from("leave_approval")
        .insert([{
          leave_id: selectedLeave.id,
          status,
          comment,
        }]);

      if (approvalError) {
        setError("Failed to store approval/rejection.");
        console.error(approvalError);
        return;
      }

      // Call the notification function after updating the leave request
      await insertLeaveNotification(selectedLeave.employee_id, selectedLeave.id, status);

      fetchLeaveRequests(); // Refresh the leave requests list
      setSelectedLeave(null); // Close the modal
      setComment(""); // Reset the comment field

      // Success feedback
      if (status === "Approved") {
        setSuccessMessage("Leave request approved successfully.");
        setRejectMessage(null); // Clear rejection message
      } else {
        setRejectMessage("Leave request rejected successfully.");
        setSuccessMessage(null); // Clear success message
      }

      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        setRejectMessage(null);
      }, 3000);

    } catch (err) {
      setError("An error occurred while processing the request.");
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setSelectedLeave(null);
    setComment("");
    setEmployeeDetails(null);
    setError(null); // Clear error on modal close
    setSuccessMessage(null); // Clear success message
    setRejectMessage(null); // Clear rejection message
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("modal")) {
      handleModalClose();
    }
  };

  return (
    <div className="leave-approval-container p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Leave Approval</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>} {/* Success Message */}
      {rejectMessage && <p className="text-red-500 mb-4">{rejectMessage}</p>} {/* Rejection Message */}

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Leave Type</th>
            <th className="py-2 px-4 border">Start Date</th>
            <th className="py-2 px-4 border">End Date</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((record) => (
            <tr key={record.id}>
              <td className="py-2 px-4 border">{record.leave_type}</td>
              <td className="py-2 px-4 border">{record.start_date}</td>
              <td className="py-2 px-4 border">{record.end_date}</td>
              <td className="py-2 px-4 border">{record.status}</td>
              <td className="py-2 px-4 border">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                  onClick={() => {
                    setSelectedLeave(record);
                    fetchEmployeeDetails(record.employee_id);
                  }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
         
      {selectedLeave && (
        <div
          className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
          onClick={handleClickOutside}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={handleModalClose}
            >
              X
            </button>
            <h3 className="text-xl font-semibold mb-4">Leave Request Details</h3>
            {employeeDetails && (
              <>
                <p><strong>Employee Name:</strong> {employeeDetails.first_name} {employeeDetails.last_name}</p>
                <p><strong>Department:</strong> {employeeDetails.departments.name}</p>
              </>
            )}
            <p><strong>Leave Type:</strong> {selectedLeave.leave_type}</p>
            <p><strong>Start Date:</strong> {selectedLeave.start_date}</p>
            <p><strong>End Date:</strong> {selectedLeave.end_date}</p>

            <p><strong>Existing Comment:</strong> {selectedLeave.comment || "No comment provided"}</p> {/* Display existing comment */}

            <textarea
              className="w-full border p-2 rounded mt-4"
              placeholder="Comment (Required for approval/rejection)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="flex justify-between mt-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleApproveReject("Approved")}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                onClick={() => handleApproveReject("Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
   

    


    </div>
  );
//};

//export default LeaveApproval;


/* */  {/* 
    
    */}
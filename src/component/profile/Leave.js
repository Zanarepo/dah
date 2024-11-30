import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Countdown from "./Countdown";
import LeaveHistory from './LeaveHistory.js';  // Correct relative path to LeaveHistory component



const Leave = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  // Fetch employee ID from local storage on component mount
useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employee_id");
    if (storedEmployeeId) {
      setEmployeeId(parseInt(storedEmployeeId, 10));
    } else {
      setError("Employee ID is missing in local storage.");
    }
  }, []);

  <Countdown leaveId={123} employeeId={456} />
  
  // Fetch leave records and leave history
  useEffect(() => {
    if (employeeId) {
      fetchLeaveRecords();
   
    }
  }, [employeeId]);
  
  // Function to fetch current leave records
  const fetchLeaveRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("employee_leave")
        .select("*")
        .eq("employee_id", employeeId)
        .order("start_date", { ascending: false });
  
      if (error) throw error;
      setLeaveRecords(data);
    } catch (err) {
      console.error("Error fetching leave records:", err);
      setError("Failed to fetch leave records");
    } finally {
      setLoading(false);
    }
  };


  // Function to fetch leave history (archived leaves)

  // Handle leave submission
  const handleLeaveSubmit = async () => {
    if (!leaveDetails.leaveType || !leaveDetails.startDate || !leaveDetails.endDate) {
      setError("All fields are required");
      return;
    }
  
    try {
      // Close modal immediately for better UX
      setIsModalOpen(false);
  
      const { data, error } = await supabase
        .from("employee_leave")
        .insert([
          {
            employee_id: employeeId,
            leave_type: leaveDetails.leaveType,
            start_date: leaveDetails.startDate,
            end_date: leaveDetails.endDate,
            status: leaveDetails.status,
          },
        ])
        .select(); // Ensure inserted data is returned
  
      // Debugging: Log the response from Supabase
      console.log("Supabase Response:", { data, error });
  
      // Handle any error returned by Supabase
      if (error) {
        console.error("Error inserting leave:", error);
        setError("Failed to submit leave request");
        return;
      }
  
      // Validate the `data` returned
      if (data && data.length > 0) {
        setLeaveRecords([data[0], ...leaveRecords]); // Add new record
        setSuccessMessage("Leave request submitted successfully!");
  
        // Clear the leave details form
        setLeaveDetails({
          leaveType: "",
          startDate: "",
          endDate: "",
          status: "Pending",
        });
  
        // Automatically clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        // If `data` is empty, treat it as an unexpected issue
        setError("Unexpected error: No data returned from server");
      }
    } catch (err) {
      console.error("Unexpected error:", err); // Log unexpected errors
      setError("An unexpected error occurred while submitting the leave request");
    }
  };
  
  return (
    <div className="leave-component-container p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Leave Management</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message text-green-500 text-sm mb-4">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message text-red-500 text-sm mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-blue-500" />
        </div>
      ) : (
        <>
          {/* Leave Request Form Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-6 hover:bg-blue-600"
          >
            Request Leave
  

          </button>
        
          {/* Leave Request Modal */}
          {isModalOpen && (
            <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
              <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Request Leave</h3>
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium mb-2">Leave Type</label>
                  <select
                    value={leaveDetails.leaveType}
                    onChange={(e) => setLeaveDetails({ ...leaveDetails, leaveType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={leaveDetails.startDate}
                    onChange={(e) => setLeaveDetails({ ...leaveDetails, startDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={leaveDetails.endDate}
                    onChange={(e) => setLeaveDetails({ ...leaveDetails, endDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="form-group flex justify-end">
                  <button
                    onClick={handleLeaveSubmit}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg ml-2 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Leave Records */}
          {leaveRecords.length > 0 ? (
            <div className="leave-records mb-6">
              <h3 className="text-xl font-semibold mb-4">Active Leave Records</h3>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 border-b">Leave Type</th>
                    <th className="text-left py-2 px-4 border-b">Start Date</th>
                    <th className="text-left py-2 px-4 border-b">End Date</th>
                    <th className="text-left py-2 px-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="py-2 px-4 border-b">{record.leave_type}</td>
                      <td className="py-2 px-4 border-b">{record.start_date}</td>
                      <td className="py-2 px-4 border-b">{record.end_date}</td>
                      <td className="py-2 px-4 border-b">{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No active leave records.</p>
          )}

          {/* Leave History */}
          {leaveHistory.length > 0 ? (
            <div className="leave-history">
              <h3 className="text-xl font-semibold mb-4">Leave History</h3>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 border-b">Leave Type</th>
                    <th className="text-left py-2 px-4 border-b">Start Date</th>
                    <th className="text-left py-2 px-4 border-b">End Date</th>
                    <th className="text-left py-2 px-4 border-b">Status</th>
                    <th className="text-left py-2 px-4 border-b">Archived At</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.map((history) => (
                    <tr key={history.id}>
                      <td className="py-2 px-4 border-b">{history.leave_type}</td>
                      <td className="py-2 px-4 border-b">{history.start_date}</td>
                      <td className="py-2 px-4 border-b">{history.end_date}</td>
                      <td className="py-2 px-4 border-b">{history.status}</td>
                      <td className="py-2 px-4 border-b">{history.archived_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>  
            {/* Leave History Section */}
            <LeaveHistory /> {/* This is where the LeaveHistory component is inserted */}
             </p>
          )}
        </>
      )}
    </div>
  );
};

export default Leave;

       
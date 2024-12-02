import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Countdown from "./Countdown";

const Leave = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    ministryId: null,  // Ministry ID for leave
    departmentId: null,  // Department ID for leave
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State for tracking form submission

  // Fetch employee ID from local storage on component mount
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employee_id");
    if (storedEmployeeId) {
      setEmployeeId(parseInt(storedEmployeeId, 10));
    } else {
      setError("Employee ID is missing in local storage.");
    }
  }, []);

  // Fetch leave records
  useEffect(() => {
    if (employeeId) {
      fetchLeaveRecords();
    }
  }, [employeeId]);

  // Function to fetch current leave records
  const fetchLeaveRecords = async () => {
    try {
      setLoading(true); // Start loading
      const { data, error } = await supabase
        .from("employee_leave")
        .select("*")
        .eq("employee_id", employeeId)
        .order("start_date", { ascending: false });

      if (error) throw error;

      const currentDate = new Date();
      const activeLeave = [];

      // Loop through each leave record
      for (let record of data) {
        const endDate = new Date(record.end_date);
        if (endDate >= currentDate) {
          activeLeave.push(record);  // Active leave
        }
      }

      // Set active leave
      setLeaveRecords(activeLeave);
    } catch (err) {
      console.error("Error fetching leave records:", err);
      setError("Failed to fetch leave records");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const handleLeaveSubmit = async () => {
    if (!leaveDetails.leaveType || !leaveDetails.startDate || !leaveDetails.endDate) {
      setError("All fields are required");
      return;
    }
  
    try {
      setIsSubmitting(true); // Start submitting
      setIsModalOpen(false); // Close modal immediately for better UX
  
      // Fetch employee profile from the employee_profiles table
      const { data: employeeProfile, error: profileError } = await supabase
        .from("employee_profiles")
        .select("ministry_id, department_id")
        .eq("employee_id", employeeId)  // Using employee_id from employee_profiles
        .single();
  
      if (profileError) {
        console.error("Error fetching employee profile:", profileError);
        setError("Failed to fetch employee profile");
        return;
      }
  
      // Insert leave request with dynamic ministry and department info
      const { data, error } = await supabase
        .from("employee_leave")
        .insert([{
          employee_id: employeeId,
          leave_type: leaveDetails.leaveType,
          start_date: leaveDetails.startDate,
          end_date: leaveDetails.endDate,
          status: leaveDetails.status,
          ministry_id: employeeProfile.ministry_id, // Automatically set ministry_id
          department_id: employeeProfile.department_id, // Automatically set department_id
        }])
        .select(); // Ensure inserted data is returned
  
      if (error) {
        console.error("Error inserting leave:", error);
        setError("Failed to submit leave request");
        return;
      }
  
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
        setError("Unexpected error: No data returned from server");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while submitting the leave request");
    } finally {
      setIsSubmitting(false); // Stop submitting
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
            disabled={isSubmitting} // Disable button during submission
          >
            {isSubmitting ? "Submitting..." : "Request Leave"}
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
               
                <div className="flex justify-end">
                  <button
                    onClick={handleLeaveSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    disabled={isSubmitting}
                  >
                    Submit Request
                  </button>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 text-sm text-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Active Leave Records */}
          {leaveRecords.length > 0 ? (
            leaveRecords.map((leave, index) => (
              <div key={index} className="leave-record mb-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="leave-details flex justify-between">
                  <div className="leave-type">
                    <strong>{leave.leave_type}</strong>
                  </div>
                  <div className="leave-dates text-sm text-gray-500">
                    {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="leave-status text-sm">
                  Status: {leave.status}
                </div>
                <Countdown date={leave.end_date} />
              </div>
            ))
          ) : (
            <div className="no-leave-records text-sm text-gray-500">
              No active leave records found.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leave;

import React, { useState, useEffect } from "react";

const EmployeeLeaveAndRetirement = ({ employeeData, setEmployeeData }) => {
  const [leaveData, setLeaveData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    status: "Pending", // Default status
  });

  const [notification, setNotification] = useState(null);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [showModal, setShowModal] = useState(false); // Track the modal visibility
  const [retirementDate, setRetirementDate] = useState(null); // Retirement date

  // Handle input changes for leave application
  const handleLeaveChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submitting the leave application
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    // Assuming an API function that handles the leave request submission
    const response = await fetch("/api/employee-leave", {
      method: "POST",
      body: JSON.stringify({
        employee_id: employeeData.employee_id,
        leave_type: leaveData.leave_type,
        start_date: leaveData.start_date,
        end_date: leaveData.end_date,
        status: leaveData.status,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setNotification("Leave application submitted successfully.");
      fetchLeaveApplications(); // Reload leave applications after submitting
      setShowModal(false); // Close the modal after submitting
    } else {
      setNotification("Failed to submit leave application.");
    }
  };

  // Fetch leave applications for the employee
  const fetchLeaveApplications = async () => {
    const response = await fetch(`/api/employee-leave/${employeeData.employee_id}`);
    const data = await response.json();
    setLeaveApplications(data);
  };

  // Effect to fetch leave applications when the component loads
  useEffect(() => {
    fetchLeaveApplications();
    // Fetch retirement date (Assuming it's a field from the employee data)
    if (employeeData.retirement_date) {
      setRetirementDate(new Date(employeeData.retirement_date));
    }
  }, [employeeData.employee_id]);

  // Calculate countdown to retirement
  const calculateRetirementCountdown = () => {
    if (!retirementDate) return null;
    const now = new Date();
    const timeDifference = retirementDate - now;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining >= 0 ? daysRemaining : 0; // Return 0 if past retirement date
  };

  // Calculate leave countdown (in case leave is approved)
  const calculateLeaveCountdown = (leave) => {
    if (leave.status !== "Approved") return null; // Only show countdown if approved
    const now = new Date();
    const endDate = new Date(leave.end_date);
    const timeDifference = endDate - now;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining >= 0 ? daysRemaining : 0; // Return 0 if past leave end date
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Leave and Retirement</h2>

      {/* Countdown to Retirement */}
      <div className="mt-4 p-4 border border-gray-300 rounded">
        <h3 className="font-semibold">Countdown to Retirement</h3>
        <p>{calculateRetirementCountdown()} days remaining until retirement</p>
      </div>

      {/* Leave Status */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Leave Applications</h3>
        <div className="mt-4">
          {leaveApplications.length === 0 ? (
            <p>No leave applications submitted yet.</p>
          ) : (
            <ul>
              {leaveApplications.map((leave) => (
                <li key={leave.id} className="mb-4 p-4 border border-gray-300 rounded">
                  <div>
                    <strong>Leave Type:</strong> {leave.leave_type}
                  </div>
                  <div>
                    <strong>Start Date:</strong> {leave.start_date}
                  </div>
                  <div>
                    <strong>End Date:</strong> {leave.end_date}
                  </div>
                  <div>
                    <strong>Status:</strong> {leave.status}
                  </div>
                  {leave.status === "Approved" && (
                    <p className="mt-2">
                      {calculateLeaveCountdown(leave)} days remaining for leave
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal to Apply for Leave */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
            <form onSubmit={handleLeaveSubmit}>
              <div className="mb-4">
                <label htmlFor="leave_type" className="block text-sm font-medium">Leave Type</label>
                <select
                  id="leave_type"
                  name="leave_type"
                  value={leaveData.leave_type}
                  onChange={handleLeaveChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="start_date" className="block text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={leaveData.start_date}
                  onChange={handleLeaveChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="end_date" className="block text-sm font-medium">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={leaveData.end_date}
                  onChange={handleLeaveChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Submit Leave Application
              </button>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Button to Open Modal for Leave Application */}
      <div className="mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Apply for Leave
        </button>
      </div>

      {/* Display Notification */}
      {notification && (
        <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          {notification}
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveAndRetirement;

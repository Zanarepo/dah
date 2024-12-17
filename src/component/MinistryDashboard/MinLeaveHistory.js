import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added `useNavigate` for back navigation
import { supabase } from "../../supabaseClient";
import { MagnifyingGlassIcon,  CalendarIcon } from '@heroicons/react/24/outline';
// Heroicons for UI

const MinistryLeaveHistory = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate(); // For back navigation
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // For searching by employee name
  const [leaveStatusFilter, setLeaveStatusFilter] = useState(""); // For filtering by leave status
  const [dateFilter, setDateFilter] = useState(""); // For filtering by date
  const [message, setMessage] = useState(""); // Success/Failure message
  const [messageType, setMessageType] = useState(""); // Type of message (success/error)

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
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
        )
        .eq("department_id", departmentId); // Department-specific data

      if (error) {
        console.error("Error fetching leave history:", error.message);
      } else {
        setLeaveHistory(data);
      }
      setLoading(false);
    };

    fetchLeaveHistory();
  }, [departmentId]);

  // Handle delete request
  const handleDelete = async (leaveId) => {
    const { error } = await supabase
      .from("employee_leave")
      .delete()
      .eq("id", leaveId);

    if (error) {
      console.error("Error deleting leave request:", error.message);
      setMessage("Failed to delete leave request.");
      setMessageType("error");
    } else {
      setLeaveHistory(leaveHistory.filter((leave) => leave.id !== leaveId));
      setMessage("Leave request has been deleted successfully.");
      setMessageType("success");
    }

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Filter leave history based on name, date, or leave status
  const filteredLeaveHistory = leaveHistory.filter((leave) => {
    const matchesName = `${leave.employee_profiles.first_name} ${leave.employee_profiles.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = leave.status
      .toLowerCase()
      .includes(leaveStatusFilter.toLowerCase());
    const matchesDate =
      dateFilter === "" ||
      (new Date(leave.start_date).toISOString().slice(0, 10) === dateFilter ||
        new Date(leave.end_date).toISOString().slice(0, 10) === dateFilter);
    return matchesName && matchesStatus && matchesDate;
  });

  const handleDownload = () => {
    // Function to download the leave history as a CSV or JSON file
    const csvContent = [
      ["Employee Name", "Leave Type", "Start Date", "End Date", "Status", "Comment"],
      ...filteredLeaveHistory.map((leave) => [
        `${leave.employee_profiles.first_name} ${leave.employee_profiles.last_name}`,
        leave.leave_type,
        leave.start_date,
        leave.end_date,
        leave.status,
        leave.comment || "No comment",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leave_history.csv";
    link.click();
  };

  if (loading) return <p>Loading leave history...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="mb-4 p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Leave History</h2>

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

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
          <CalendarIcon className="h-5 w-5 text-gray-500" />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={leaveStatusFilter}
            onChange={(e) => setLeaveStatusFilter(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="ml-auto bg-blue-500 text-white py-2 px-4 rounded"
        >
          Download
        </button>
      </div>

      {filteredLeaveHistory.length > 0 ? (
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
            {filteredLeaveHistory.map((leave) => (
              <tr key={leave.id}>
                <td className="border border-gray-200 px-4 py-2">
                  {leave.employee_profiles
                    ? `${leave.employee_profiles.first_name} ${leave.employee_profiles.last_name}`
                    : "Unknown"}
                </td>
                <td className="border border-gray-200 px-4 py-2">{leave.leave_type}</td>
                <td className="border border-gray-200 px-4 py-2">{leave.start_date}</td>
                <td className="border border-gray-200 px-4 py-2">{leave.end_date}</td>
                <td
                  className={`border border-gray-200 px-4 py-2 ${
                    leave.status === "Approved"
                      ? "bg-green-100"
                      : leave.status === "Rejected"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  }`}
                >
                  {leave.status}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(leave.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No leave requests found for this department.</p>
      )}
    </div>
  );
};

export default MinistryLeaveHistory;

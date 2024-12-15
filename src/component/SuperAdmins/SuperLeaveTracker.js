import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Navigation hooks
import { supabase } from "../../supabaseClient";

// Enhanced Icons for different leave statuses
const statusIcons = {
  Pending: "fa-hourglass-half", // FontAwesome Hourglass
  Active: "fa-check-circle",    // FontAwesome Checkmark
  Approved: "fa-thumbs-up",     // FontAwesome Thumbs Up
  Rejected: "fa-times-circle",  // FontAwesome Cross
  Expired: "fa-clock",          // FontAwesome Clock
};

const LeaveTracker = () => {
  const { departmentId } = useParams(); // Get the department ID from the URL
  const navigate = useNavigate(); // For back navigation
  const [leaveStatuses, setLeaveStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userAccessLevel, setUserAccessLevel] = useState(null); // To store the user's access level

  useEffect(() => {
    const fetchUserAccessLevel = async () => {
      try {
        // Fetch the user's access level from the access_level table
        const userId = localStorage.getItem("employee_id"); // Assuming employee_id is stored in localStorage
        const { data, error } = await supabase
          .from("access_level")
          .select("access_id")
          .eq("employee_id", userId)
          .single();

        if (error) throw error;
        setUserAccessLevel(data.access_id);
      } catch (err) {
        console.error("Error fetching user access level:", err.message);
        setError("Failed to load user access data.");
      }
    };

    fetchUserAccessLevel();
  }, []);

  useEffect(() => {
    const fetchLeaveStatuses = async () => {
      if (userAccessLevel === null) return; // Wait until the user access level is fetched

      setLoading(true);
      try {
        let query = supabase.from("employee_leave").select("status");

        // If the user is not a super admin, filter by department
        if (userAccessLevel !== 3) {
          query = query.eq("department_id", departmentId); // Filter by department_id
        }

        const { data, error } = await query;

        if (error) throw error;

        // Group the leave data by status
        const groupedStatuses = data.reduce((acc, leave) => {
          const { status } = leave;
          if (acc[status]) {
            acc[status]++;
          } else {
            acc[status] = 1;
          }
          return acc;
        }, {});

        // Convert the grouped data into an array of status objects
        const formattedStatuses = Object.keys(groupedStatuses).map((status) => ({
          status,
          count: groupedStatuses[status],
        }));

        setLeaveStatuses(formattedStatuses);
      } catch (err) {
        console.error("Error fetching leave statuses:", err.message);
        setError("Failed to load leave tracking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveStatuses();
  }, [userAccessLevel, departmentId]); // Refetch when access level or department changes

  const statusColors = {
    Pending: "bg-blue-600",
    Active: "bg-green-600",
    Approved: "bg-purple-600",
    Rejected: "bg-red-600",
    Expired: "bg-gray-600",
  };

  if (loading) return <p>Loading leave tracking data...</p>;

  if (error)
    return (
      <div className="max-w-4xl mx-auto p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page (department dashboard)
        className="mb-4 p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Leave Tracker for Department</h2>

      {leaveStatuses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaveStatuses.map(({ status, count }) => (
            <div
              key={status}
              className={`p-6 rounded-lg shadow-lg text-white ${
                statusColors[status] || "bg-gray-400"
              } hover:scale-105 transform transition-all duration-200`}
            >
              {/* Display the icon and status */}
              <div className="text-5xl mb-4 flex justify-center">
                <i className={`fas ${statusIcons[status]}`} />
              </div>
              <h3 className="text-lg font-bold text-center">{status}</h3>
              <p className="text-3xl font-bold text-center mt-2">{count}</p>
              <p className="text-center">Leave(s)</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No leave tracking data available for this department.</p>
      )}
    </div>
  );
};

export default LeaveTracker;

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you have a Supabase client setup

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        // Fetch leave history from employee_leave table
        const { data, error } = await supabase
          .from("employee_leave") // Fetching from the employee_leave table
          .select(`
            id,
            leave_type,
            start_date,
            end_date,
            status,
            employee_profiles (
              first_name,
              last_name,
              department
            )
          `)
          .order("end_date", { ascending: false }); // Order by end date, most recent first

        if (error) throw error;

        // Filter out the expired leaves (leaves where end_date has passed)
        const currentDate = new Date();
        const expiredLeaves = data.filter((leave) => new Date(leave.end_date) < currentDate);

        setLeaveHistory(expiredLeaves || []); // Ensure `data` is not null
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leave history:", err);
        setError("Failed to fetch leave history");
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Leave History</h2>

      {loading && <p>Loading leave history...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {leaveHistory.length === 0 ? (
        <p>No expired leave records available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Leave Type</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave) => {
                // Check for undefined/null employee_profiles
                const profile = leave.employee_profiles || {};
                return (
                  <tr key={leave.id}>
                    <td className="border px-4 py-2">{profile.first_name || "N/A"}</td>
                    <td className="border px-4 py-2">{profile.last_name || "N/A"}</td>
                    <td className="border px-4 py-2">{profile.department || "N/A"}</td>
                    <td className="border px-4 py-2">{leave.leave_type}</td>
                    <td className="border px-4 py-2">{new Date(leave.start_date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{new Date(leave.end_date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{leave.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;

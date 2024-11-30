import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you have a Supabase client setup

const LeaveTracking = () => {
  const [leaveData, setLeaveData] = useState({
    activeLeaves: [],
    pendingLeaves: [],
    finishedLeaves: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        // Fetch leave requests and employee profiles
        const { data: leaveRequests, error: leaveError } = await supabase
          .from("employee_leave")
          .select("*, employee_profiles (first_name, last_name, department, position, profile_picture)")
          .eq("status", "Approved");  // We only want approved requests for this table

        if (leaveError) throw leaveError;

        const today = new Date();

        // Categorizing leave requests based on current date
        const activeLeaves = [];
        const pendingLeaves = [];
        const finishedLeaves = [];

        leaveRequests.forEach((request) => {
          const startDate = new Date(request.start_date);
          const endDate = new Date(request.end_date);

          if (startDate <= today && endDate >= today) {
            // Active leave: the current date is within the leave period
            activeLeaves.push(request);
          } else if (startDate > today) {
            // Pending leave: the leave start date is in the future
            pendingLeaves.push(request);
          } else if (endDate < today) {
            // Finished leave: the leave has ended
            finishedLeaves.push(request);
          }
        });

        setLeaveData({
          activeLeaves,
          pendingLeaves,
          finishedLeaves,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leave data.");
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Leave Tracking Dashboard</h2>

      {loading && <p>Loading leave data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Active Leaves</h3>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Profile Picture</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Position</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.activeLeaves.map((leave, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <img
                    src={leave.employee_profiles.profile_picture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="border p-2">{leave.employee_profiles.first_name}</td>
                <td className="border p-2">{leave.employee_profiles.last_name}</td>
                <td className="border p-2">{leave.employee_profiles.department}</td>
                <td className="border p-2">{leave.employee_profiles.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Pending Leaves</h3>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Profile Picture</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Position</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.pendingLeaves.map((leave, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <img
                    src={leave.employee_profiles.profile_picture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="border p-2">{leave.employee_profiles.first_name}</td>
                <td className="border p-2">{leave.employee_profiles.last_name}</td>
                <td className="border p-2">{leave.employee_profiles.department}</td>
                <td className="border p-2">{leave.employee_profiles.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Finished Leaves</h3>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Profile Picture</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Position</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.finishedLeaves.map((leave, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <img
                    src={leave.employee_profiles.profile_picture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="border p-2">{leave.employee_profiles.first_name}</td>
                <td className="border p-2">{leave.employee_profiles.last_name}</td>
                <td className="border p-2">{leave.employee_profiles.department}</td>
                <td className="border p-2">{leave.employee_profiles.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTracking;

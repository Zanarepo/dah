import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const LeaveStatusTracker = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [error, setError] = useState(null);
  const [setDepartmentAdminId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartmentAdminId();
  }, []);

  // Fetch the department_id for the logged-in user from department_admins table
  const fetchDepartmentAdminId = async () => {
    const adminEmployeeId = localStorage.getItem("employee_id"); // Assuming employee_id is stored in localStorage for logged-in user

    if (!adminEmployeeId) {
      setError("You are not logged in.");
      return;
    }

    try {
      const { data: adminData, error: adminError } = await supabase
        .from('department_admins')
        .select('department_id')
        .eq('employee_id', adminEmployeeId)
        .maybeSingle();

      if (adminError) {
        throw new Error(adminError.message);
      }

      if (!adminData) {
        setError('You are not assigned to any department.');
        return;
      }

      const departmentId = adminData.department_id;
      setDepartmentAdminId(departmentId);
      fetchLeaveRecords(departmentId); // Fetch leave records after department ID is fetched
    } catch (err) {
      console.error(err);
      setError("Failed to fetch department information.");
    }
  };

  // Fetch leave records only for the specific department the admin has access to
  const fetchLeaveRecords = async (departmentId) => {
    try {
      const { data, error } = await supabase
        .from("employee_leave")
        .select("id, leave_type, start_date, end_date, status, department_id")
        .eq("department_id", departmentId); // Filter by department_id

      if (error) throw error;

      setLeaveRecords(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave records.");
    }
  };

  // Function to determine the leave status
  const determineStatus = (leave) => {
    const currentDate = new Date();
    const startDate = new Date(leave.start_date);
    const endDate = new Date(leave.end_date);

    if (leave.status === "Rejected") {
      return { label: "Rejected", color: "bg-gray-400" };
    } else if (currentDate < startDate) {
      return { label: "Pending", color: "bg-blue-400" };
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return { label: "Active", color: "bg-green-400" };
    } else if (currentDate > endDate) {
      return { label: "Expired", color: "bg-red-400" };
    }
  };

  return (
    <div className="leave-status-tracker p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Leave Status Tracker</h2>
      <button
            className="text-gray-600 hover:text-gray-900 text-lg"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
      

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Leave Type</th>
            <th className="py-2 px-4 border">Start Date</th>
            <th className="py-2 px-4 border">End Date</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRecords.map((leave) => {
            const { label, color } = determineStatus(leave);
            return (
              <tr key={leave.id}>
                <td className="py-2 px-4 border">{leave.leave_type}</td>
                <td className="py-2 px-4 border">{leave.start_date}</td>
                <td className="py-2 px-4 border">{leave.end_date}</td>
                <td className={`py-2 px-4 border ${color} text-white font-semibold`}>
                  {label}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveStatusTracker;

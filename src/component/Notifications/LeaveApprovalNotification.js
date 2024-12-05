import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const AdminLeaveNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [departments, setDepartments] = useState([]); // To store department data

  useEffect(() => {
    // Fetch departments once
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from("departments")
          .select("id, name"); // Get department id and name

        if (error) throw error;

        setDepartments(data); // Store department data
      } catch (err) {
        console.error("Error fetching departments:", err.message);
      }
    };

    // Fetch leave requests and employee details
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("employee_leave")
          .select(`
            id,
            leave_type,
            start_date,
            end_date,
            employee_id,
            employee_profiles!employee_leave_employee_id_fkey (
              first_name,
              last_name,
              department_id
            )
          `)
          .eq("status", "Pending");

        if (error) throw error;

        // Map leave requests with department names
        const notificationsWithDepartment = data.map((leave) => {
          // Find department name by department_id
          const department = departments.find(
            (dept) => dept.id === leave.employee_profiles.department_id
          );

          return {
            id: leave.id,
            employee_id: leave.employee_id,
            leave_type: leave.leave_type,
            start_date: leave.start_date,
            end_date: leave.end_date,
            first_name: leave.employee_profiles.first_name,
            last_name: leave.employee_profiles.last_name,
            department_name: department ? department.name : "No department found", // Handle missing department
          };
        });

        setNotifications(notificationsWithDepartment); // Set the notifications with department name
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
      }
    };

    // Fetch both departments and notifications
    fetchDepartments();
    fetchNotifications();
  }, [departments]); // Re-run fetchNotifications when departments are loaded

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Leave Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="mb-2 p-2 border">
              <p>
                <strong>{notification.leave_type}</strong> leave requested by{" "}
                {notification.first_name} {notification.last_name} (Employee ID:{" "}
                {notification.employee_id})
              </p>
              <p>Department: {notification.department_name}</p>
              <p>
                Start Date: {notification.start_date}, End Date:{" "}
                {notification.end_date}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default AdminLeaveNotification;

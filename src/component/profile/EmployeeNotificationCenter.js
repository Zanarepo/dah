import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient"; // Ensure the import is correct
import { toast } from "react-toastify"; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const EmployeeNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotificationMessage, setNewNotificationMessage] = useState("");
  const [error, setError] = useState("");
  const [departmentId, setDepartmentId] = useState(null); // Track the departmentId
  const [ministryId, setMinistryId] = useState(null); // Track the ministryId

  // Fetch notifications based on the user's role (admin, ministry admin, super admin)
  const fetchNotifications = useCallback(async (profileData) => {
    try {
      const userRole = profileData.is_admin
        ? "department_admin"
        : profileData.is_admin_ministry
        ? "ministry_admin"
        : "employee";

      let query = supabase
        .from("general_notifications")
        .select("id, message, is_read, created_at, department_id, ministry_id")
        .order("created_at", { ascending: false });

      // Filtering logic based on user role
      if (userRole === "department_admin") {
        query = query.eq("department_id", profileData.department_id); // Department admin sees only their department's notifications
      } else if (userRole === "ministry_admin") {
        query = query.eq("ministry_id", profileData.ministry_id); // Ministry admin sees all departments in their ministry
      } else if (userRole === "employee") {
        query = query.eq("employee_id", profileData.employee_id); // Employee sees their own notifications
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching notifications:", fetchError);
        setError("Error fetching notifications");
        toast.error("Error fetching notifications"); // Toast notification for error
        return;
      }

      if (!data || data.length === 0) {
        setError("No notifications found");
        toast.info("No notifications found"); // Toast notification for info
        return;
      }

      setNotifications(data);
      toast.success("Notifications fetched successfully"); // Toast notification for success
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Error fetching notifications");
      toast.error("Error fetching notifications"); // Toast notification for error
    }
  }, [setNotifications]); // Added setNotifications as a dependency

  // Fetch the user's profile and role from the employee_profiles table
  const fetchUserProfile = useCallback(async () => {
    const storedUserId = localStorage.getItem("employee_id");

    if (!storedUserId) {
      setError("User is not authenticated");
      toast.error("User is not authenticated"); // Toast notification for error
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("employee_profiles")
        .select("employee_id, department_id, ministry_id, is_admin, is_admin_ministry, role")
        .eq("employee_id", storedUserId)
        .single();

      if (profileError || !profileData) {
        setError("User profile not found or error fetching profile");
        toast.error("User profile not found or error fetching profile"); // Toast notification for error
        return;
      }

      setDepartmentId(profileData.department_id);
      setMinistryId(profileData.ministry_id);

      fetchNotifications(profileData); // Fetch notifications based on profile
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Error fetching user profile");
      toast.error("Error fetching user profile"); // Toast notification for error
    }
  }, [fetchNotifications]); // Added fetchNotifications as a dependency

  // Create a reminder notification (to be channeled to the right admins)
  const createReminderNotification = async () => {
    if (!newNotificationMessage) {
      setError("Notification message cannot be empty");
      toast.error("Notification message cannot be empty"); // Toast notification for error
      return;
    }

    const storedUserId = localStorage.getItem("employee_id");

    if (!storedUserId) {
      setError("User is not authenticated");
      toast.error("User is not authenticated"); // Toast notification for error
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("general_notifications")
        .insert([{
          employee_id: storedUserId,
          message: newNotificationMessage,
          type: "Reminder",
          is_read: false,
          created_at: new Date().toISOString(),
          department_id: departmentId,
          ministry_id: ministryId,
        }]);

      if (insertError) {
        console.error("Error creating notification:", insertError);
        setError("Error creating notification");
        toast.error("Error creating notification"); // Toast notification for error
        return;
      }

      setNewNotificationMessage(""); // Clear input
      fetchNotifications({ employee_id: storedUserId, department_id: departmentId, ministry_id: ministryId });
      toast.success("Reminder notification created successfully"); // Toast notification for success
    } catch (error) {
      console.error("Error creating notification:", error);
      setError("Error creating notification");
      toast.error("Error creating notification"); // Toast notification for error
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile and notifications on mount
  }, [fetchUserProfile]); // Added fetchUserProfile as dependency

  return (
    <div className="min-h-screen bg-white p-6">
      {error && <div className="text-red-500">{error}</div>}

      <h1 className="text-xl font-bold mb-4">Your Notifications</h1>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-gray-500">No notifications available</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg ${notification.is_read ? "bg-gray-100" : "bg-white"}`}
            >
              <p>{notification.message}</p>
              <div className="text-sm text-gray-500">
                {new Date(notification.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={newNotificationMessage}
          onChange={(e) => setNewNotificationMessage(e.target.value)}
          placeholder="Enter a reminder message"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={createReminderNotification}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Create Reminder Notification
        </button>
      </div>

      {/* Toast Container */}
      <toast.Container />
    </div>
  );
};

export default EmployeeNotificationCenter;

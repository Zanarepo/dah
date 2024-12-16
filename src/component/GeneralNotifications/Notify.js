import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Ensure this is correct
import { MdAddAlert } from "react-icons/md"; // Bell icon with a plus sign
import NotificationModal from "../profile/NotificationModal"; // Ensure the path to NotificationModal is correct

const EmployeeNotificationCenter = () => {
  const [newNotificationMessage, setNewNotificationMessage] = useState("");
  const [notificationTopic, setNotificationTopic] = useState("");
  const [notificationType, setNotificationType] = useState(""); // New state for notification type
  const [senderDetails, setSenderDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationModal, setNotificationModal] = useState({ isOpen: false, message: "", type: "" });

  // Fetch sender details
  useEffect(() => {
    const fetchSenderDetails = async () => {
      const storedUserId = localStorage.getItem("employee_id");
  
      if (!storedUserId) {
        setNotificationModal({ isOpen: true, message: "User is not authenticated", type: "error" });
        return;
      }
  
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("employee_id, first_name, last_name, department_id, ministry_id")
        .eq("employee_id", storedUserId)
        .single();
  
      if (error) {
        setNotificationModal({ isOpen: true, message: "Failed to fetch sender details", type: "error" });
        return;
      }
  
      setSenderDetails({
        employee_id: data.employee_id,  // Ensure employee_id is correctly fetched
        name: `${data.first_name} ${data.last_name}`,
        department_id: data.department_id,
        ministry_id: data.ministry_id,
      });
    };
  
    fetchSenderDetails();
  }, []);

  // Add new notification
  const createNotification = async () => {
    if (!notificationType || !newNotificationMessage) {
      setNotificationModal({ isOpen: true, message: "Please provide all required information", type: "error" });
      return;
    }
  
    // Show a loading notification
    setNotificationModal({ isOpen: true, message: "Creating notification...", type: "info" });
  
    try {
      // 1. Create the notification for the employee
      const { data, error } = await supabase
        .from("general_notifications")
        .insert([ 
          {
            employee_id: senderDetails.employee_id,
            ministry_id: senderDetails.ministry_id,
            department_id: senderDetails.department_id,
            sender_id: senderDetails.employee_id,
            type: notificationType,
            message: newNotificationMessage,
          },
        ]);
  
      if (error) throw new Error("Error creating notification");
  
      // 2. Get the admin users with access_id 2 and 3
      const { data: admins, error: adminError } = await supabase
        .from("access_level")
        .select("employee_id")
        .in("access_id", [2, 3]) // Admin and super admin access IDs
        .in("department_id", [senderDetails.department_id, senderDetails.ministry_id]);
  
      if (adminError) throw new Error("Error fetching admin users");
  
      // 3. Create admin notifications with sender's details included
      const adminNotifications = admins.map((admin) => {
        const senderFullName = `${senderDetails.first_name} ${senderDetails.last_name}`;
        const senderDepartment = senderDetails.department_name; // Ensure department is correctly retrieved
  
        return {
          employee_id: admin.employee_id,
          ministry_id: senderDetails.ministry_id,
          department_id: senderDetails.department_id,
          sender_id: senderDetails.employee_id,
          type: notificationType,
          message: `From: ${senderFullName} (${senderDepartment}) - ${newNotificationMessage}`, // Enrich message with sender details
        };
      });
  
      const { error: adminNotificationError } = await supabase
        .from("general_notifications")
        .insert(adminNotifications);
  
      if (adminNotificationError) throw new Error("Error sending notifications to admins");
  
      // Success notification
      setNotificationModal({ isOpen: true, message: "Notification sent successfully!", type: "success" });
    } catch (error) {
      setNotificationModal({ isOpen: true, message: error.message || "An error occurred", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Notification Button */}
      <button
        className="fixed bottom-28 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <MdAddAlert className="text-2xl" /> {/* Bell icon with plus sign */}
      </button>

      {/* Modal for adding notifications */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Reminder Notification</h2>
            
            {/* Dropdown for notification type */}
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            >
              <option value="">Select Notification Type</option>
              <option value="Emergency">Emergency</option>
              <option value="Appointment Reminder">Appointment Reminder</option>
              <option value="Leave Approval">Leave Approval</option>
              <option value="Meeting Reminder">Meeting Reminder</option>
            </select>

            <input
              type="text"
              value={notificationTopic}
              onChange={(e) => setNotificationTopic(e.target.value)}
              placeholder="Enter notification topic"
              className="w-full p-2 border rounded-md mb-4"
            />
            <textarea
              value={newNotificationMessage}
              onChange={(e) => setNewNotificationMessage(e.target.value)}
              placeholder="Enter notification message"
              className="w-full p-2 border rounded-md mb-4"
              rows="4"
            ></textarea>
            <button
              onClick={createNotification}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition w-full"
            >
              Send Notification
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full text-center text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notificationModal.isOpen && (
        <NotificationModal
          message={notificationModal.message}
          type={notificationModal.type}
          onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
        />
      )}
    </div>
  );
};

export default EmployeeNotificationCenter;

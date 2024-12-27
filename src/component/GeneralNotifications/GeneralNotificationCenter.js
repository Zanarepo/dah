import React, { useEffect, useState } from "react";
import Fetch from "./Fetch";
import MarkNotice from "./MarkNotice";

const GeneralNotificationCentre = () => {
  const [notifications, setNotifications] = useState([]);
  const [popupMessage, setPopupMessage] = useState(""); // State for the popup message visibility

  // Fetch notifications on component mount
  useEffect(() => {
    Fetch(setNotifications)
      .then(() => console.log("Notifications fetched successfully"))
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);
  
  // Sort notifications so unread ones are at the top
  const sortedNotifications = notifications.sort((a, b) => {
    return a.is_read - b.is_read; // Unread notifications come before read
  });

  // Delete the read notifications
  const deleteReadNotifications = () => {
    // Filter out the read notifications (is_read is true)
    const updatedNotifications = notifications.filter((notice) => !notice.is_read);
    setNotifications(updatedNotifications); // Update state with only unread notifications

    // Set the popup message
    setPopupMessage("Read notifications have been deleted!");

    // Hide the popup after 3 seconds
    setTimeout(() => {
      setPopupMessage(""); // Clear popup message after 3 seconds
    }, 3000);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Notification Centre</h2>
        <button
          onClick={deleteReadNotifications} // Call deleteReadNotifications when button is clicked
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete Read Notifications
        </button>
      </div>

      {/* Show popup message after deleting notifications */}
      {popupMessage && (
        <div className="fixed top-0 right-0 m-4 p-4 bg-green-500 text-white rounded-md shadow-md">
          <p>{popupMessage}</p>
        </div>
      )}

      <div className="mt-6">
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {sortedNotifications.map((notice) => (
              <li
                key={notice.id}
                className={`flex justify-between items-center p-4 border rounded-md ${
                  notice.is_read ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <div>
                  <p className="text-lg font-medium">{notice.type}</p>
                  <p className="text-gray-600">{notice.message}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Sender:</strong> {notice.sender} ({notice.senderDepartment})
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(notice.created_at).toLocaleString()}
                  </p>
                </div>
                <MarkNotice
                  id={notice.id}
                  isRead={notice.is_read}
                  refreshNotifications={() => Fetch(setNotifications)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default GeneralNotificationCentre;

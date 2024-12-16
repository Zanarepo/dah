import React, { useEffect, useState } from "react";
import Fetch from "../GeneralNotifications/Fetch";
//import CreateNotice from "./CreateNotice";
import MarkNotice from "../GeneralNotifications/MarkNotice";

const GeneralNotificationCentre = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications on component mount
  useEffect(() => {
    Fetch(setNotifications); // Calls the Fetch function and updates notifications
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Notification Centre</h2>

      <div className="mt-6">
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notice) => (
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
                  <p className="text-sm text-gray-400">{new Date(notice.created_at).toLocaleString()}</p>
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

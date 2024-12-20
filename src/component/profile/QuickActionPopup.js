
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa"; // Calendar Icon
import { MdAdd } from "react-icons/md"; // Plus icon for the floating action button
import { HiChatAlt } from "react-icons/hi"; // Chat icon
import { MdAddAlert } from "react-icons/md"; // Mail icon for notifications
import { FaTasks } from "react-icons/fa"; // Tasks icon for TodoList
//import Notify from "../GeneralNotifications/Notify"

const QuickActionPopup = () => {
  const [isOpen, setIsOpen] = useState(false); // State for popup visibility
  const navigate = useNavigate();
  const popupRef = useRef(null); // Ref to the popup div

  // Toggle the popup
  const togglePopup = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Close the modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false); // Close popup when click is outside
      }
    };

    // Adding the event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Floating Action Button */}
      <button
        onClick={togglePopup}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        <MdAdd className="text-2xl" /> {/* Plus Icon */}
      </button>

      {/* Popup Options */}
      {isOpen && (
        <div
          ref={popupRef}
          className="fixed bottom-20 right-6 bg-white p-4 shadow-md rounded-lg w-48"
        >
          <div className="flex flex-col items-start space-y-4">
            {/* Employee Chat Option */}
            <button
              onClick={() => navigate("/chatting")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <HiChatAlt className="text-blue-600 text-xl" /> {/* Chat Icon */}
              <span className="text-sm font-medium">Employee Chat</span>
            </button>
          
            {/* Leave Request Option */}
            <button
              onClick={() => navigate("/leave")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <FaCalendarAlt className="text-blue-600 text-xl" /> {/* Calendar Icon */}
              <span className="text-sm font-medium">Leave Request</span>
            </button>

            {/* Notifications Option */}
            <button
              onClick={() => navigate("/profile-notifications")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <MdAddAlert className="text-blue-600 text-xl" /> {/* Mail Icon */}
              <span className="text-sm font-medium">Notifications</span>
            </button>

            {/* Task Management Option */}
            <button
              onClick={() => navigate("/task-dashboard")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <FaTasks className="text-blue-600 text-xl" /> {/* Tasks Icon */}
              <span className="text-sm font-medium">Task Management</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionPopup;

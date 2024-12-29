import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaHome } from "react-icons/fa"; // Calendar, User and Home Icon
import { MdAdd } from "react-icons/md"; // Plus icon for the floating action button
import { HiChatAlt } from "react-icons/hi"; // Chat icon
import { MdAddAlert } from "react-icons/md"; // Mail icon for notifications
import { FaTasks, FaBell } from "react-icons/fa"; // Tasks icon for TodoList
import { CheckCircleIcon } from "@heroicons/react/24/outline";

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
    <div className="relative">
      {/* Floating Action Button */}
      <button
        onClick={togglePopup}
        className="fixed top-1/2 right-2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center z-50"
      >
        <MdAdd className="text-2xl" /> {/* Plus Icon */}
      </button>

      {/* Popup Options */}
      {isOpen && (
        <div
          ref={popupRef}
          className="fixed top-1/2 right-6 transform -translate-y-1/2 bg-white shadow-md rounded-lg w-48 z-50"
        >
          <div className="flex flex-col items-start space-y-4 p-4">
            {/* Home Option - New added button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <FaHome className="text-blue-600 text-xl" /> {/* Home Icon */}
              <span className="text-sm font-medium">Home</span>
            </button>
              {/* Profile Option */}
           
            <button
              onClick={() => navigate("/personal-details")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <FaUser className="text-blue-600 text-xl" /> {/* User Icon */}
              <span className="text-sm font-medium">Profile</span>
            </button>
            {/* Employee Chat Option */}
            <button
              onClick={() => navigate("/chatest")}
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

            {/* Checkin Component */}
            <button
              onClick={() => navigate("/attendance-board")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <CheckCircleIcon className="text-blue-600 h-6 w-6" />
              <span className="text-sm font-medium">Checkin</span>
            </button>

            {/* Notifications Option */}
            <button
              onClick={() => navigate("/profile-notifications")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <MdAddAlert className="text-blue-600 text-xl" /> {/* Mail Icon */}
              <span className="text-sm font-medium">Notifications</span>
            </button>

            {/* Notify Option */}
            <button
              onClick={() => navigate("/notify")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <FaBell className="text-blue-600 text-xl" /> {/* Notify Icon */}
              <span className="text-sm font-medium">Notify</span>
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

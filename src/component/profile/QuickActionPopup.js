import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaComments, FaCalendarAlt } from "react-icons/fa"; // Icons
import { MdAdd } from "react-icons/md"; // Plus icon for the floating action button
import { HiChatAlt } from "react-icons/hi"; // Chat icon from react-icons/hi
import { MdAddAlert } from "react-icons/md";; // Mail icon for a different option, like notifications

const QuickActionPopup = () => {
  const [isOpen, setIsOpen] = useState(false); // State for popup visibility
  const navigate = useNavigate();

  // Toggle the popup
  const togglePopup = () => {
    setIsOpen((prevState) => !prevState);
  };

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
        <div className="fixed bottom-20 right-6 bg-white p-4 shadow-md rounded-lg w-48">
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

            {/* Another Example: Mail or Notifications Option */}
            <button
              onClick={() => navigate("/profile-notifications")}
              className="flex items-center space-x-3 w-full text-gray-700 hover:text-blue-600"
            >
              <MdAddAlert className="text-blue-600 text-xl" /> {/* Mail Icon */}
              <span className="text-sm font-medium">Notifications</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionPopup;

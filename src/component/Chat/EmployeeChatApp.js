import React, { useState } from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai"; // Importing arrow icons
import ChatList from "../profile/EmpChatList";
import ChatBox from "../Chat/EmployeeChatBox";

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // Tracks visibility of chat list

  const handleSelectChat = (user) => {
    setSelectedUser(user);

    // Automatically hide the chat list on mobile after selecting a user
    if (window.innerWidth < 768) {
      setIsVisible(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat List */}
      <div
        className={`transition-all duration-300 ${
          isVisible ? "w-80" : "w-0"
        } bg-gray-800 text-white overflow-hidden`}
      >
        {isVisible && (
          <div className="h-full">
            <ChatList onSelectChat={handleSelectChat} />
          </div>
        )}
      </div>

      {/* Chat Box */}
      <div className={`flex-1 ${isVisible ? "hidden md:block" : ""}`}>
        <div className="relative h-full">
          {/* Toggle Button for Chat List (Mobile) */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute top-16 left-4 md:hidden z-10 bg-blue-500 text-white px-3 py-2 rounded-md shadow-md"
          >
            {/* Toggle with arrow icons */}
            {isVisible ? (
              <AiOutlineLeft size={24} />
            ) : (
              <AiOutlineRight size={24} />
            )}
          </button>

          {selectedUser ? (
            <ChatBox selectedUser={selectedUser} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a user to start a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

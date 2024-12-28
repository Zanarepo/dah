import React, { useState } from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai"; // Arrow icons
import ChatBox from "../profile/ChatboxTesting";
import EmployeeChatUI from "../Chat/EmployeeChatUI"; // Redesigned chat UI component

const ChatAppTesting = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // For mobile view toggle

  const handleSelectChat = (user) => {
    setSelectedUser(user);

    // Automatically hide the chat list on mobile after selecting a user
    if (window.innerWidth < 768) {
      setIsVisible(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Chat Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isVisible ? "w-80" : "w-0"
        } bg-gray-800 text-white overflow-y-auto md:w-80 md:h-full`}
      >
        {isVisible && (
          <div className="h-full">
            <EmployeeChatUI onSelectChat={handleSelectChat} />
          </div>
        )}
      </div>

      {/* Chat Box */}
      <div className={`flex-1 ${isVisible ? "hidden md:block" : "w-full"}`}>
        <div className="relative h-screen">
          {/* Toggle Button for Chat Sidebar (Mobile) */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute top-4 left-4 md:hidden z-10 bg-blue-500 text-white px-3 py-2 rounded-md shadow-md"
          >
            {isVisible ? <AiOutlineLeft size={24} /> : <AiOutlineRight size={24} />}
          </button>

          {selectedUser ? (
            <ChatBox selectedUser={selectedUser} />
          ) : (
            // Placeholder Welcome Message when no user is selected
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-lg w-full space-y-6">
                <div className="flex justify-center">
                  <img
                    src="/images/logos1.jpg"
                    alt="BuzzMe Logo"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-gray-800">
                    Welcome to <span className="text-blue-600">BuzzMe</span>
                  </h1>
                  <p className="text-lg text-gray-600">
                    An easy and fast way to engage with your co-workers - on the go.
                  </p>
                </div>
                <div className="text-gray-400 text-sm">
                  Select a co-worker to start a conversation
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAppTesting;

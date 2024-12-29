import React, { useState } from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import ChatBox from "../profile/ChatboxTesting"; // Import for user chat
import EmployeeChatUI from "../Chat/EmployeeChatUI";
import QuickActionPopup from "./QuickActionPopup";
import ChannelChatBox from "../Chat/ChannelChatBox";
import ActiveChatBox from "../Chat/ActiveChatBox"; // Import the ActiveChatBox component for active chats

const ChatAppTesting = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedActiveChat, setSelectedActiveChat] = useState(null); // Track active chat
  const [isVisible, setIsVisible] = useState(true); // For mobile view toggle

  // Handle selection of a user chat
  const handleSelectChat = (user) => {
    setSelectedUser(user);
    setSelectedChannel(null);
    setSelectedActiveChat(null);

    if (window.innerWidth < 768) setIsVisible(false);
  };

  // Handle selection of a channel chat
  const handleSelectChannel = (channelId) => {
    setSelectedChannel(channelId);
    setSelectedUser(null);
    setSelectedActiveChat(null);

    if (window.innerWidth < 768) setIsVisible(false);
  };

  // Handle selection of an active chat
  const handleSelectActiveChat = (chatData) => {
    setSelectedActiveChat(chatData);

    setSelectedUser(null);
    setSelectedChannel(null);

    if (window.innerWidth < 768) setIsVisible(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
      <QuickActionPopup />

      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${isVisible ? "w-80" : "w-0"} bg-gray-800 text-white overflow-y-auto md:w-80 md:h-full z-10`}
      >
        {isVisible && (
          <div className="h-full">
            <EmployeeChatUI
              onSelectChat={handleSelectChat}
              onSelectChannel={handleSelectChannel}
              onSelectActiveChat={handleSelectActiveChat} // Pass handler for active chats
            />
          </div>
        )}
      </div>

      {/* Main ChatBox Area */}
      <div className={`flex-1 ${isVisible ? "hidden md:block" : "w-full"}`}>
        <div className="relative h-screen">
          {/* Mobile toggle button */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute top-4 left-4 md:hidden z-20 bg-blue-500 text-white px-3 py-2 rounded-md shadow-md"
          >
            {isVisible ? <AiOutlineLeft size={24} /> : <AiOutlineRight size={24} />}
          </button>

          {/* Render active chat, user chat, or channel chat */}
          {selectedChannel ? (
            <ChannelChatBox
              channelId={selectedChannel}
              onClose={() => setSelectedChannel(null)}
            />
          ) : selectedUser ? (
            <ChatBox selectedUser={selectedUser} onClose={() => setSelectedUser(null)} />
          ) : selectedActiveChat ? (
            <div className="absolute inset-0 z-20">
              <ActiveChatBox  // Use the ActiveChatBox component here for active chat
                selectedChat={selectedActiveChat}  // Pass the full chat data here
                onClose={() => setSelectedActiveChat(null)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-lg w-full space-y-6">
                <div className="flex justify-center">
                  <img
                    src="/images/logos1.jpg"
                    alt="BuzzMe Logo"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Welcome to <span className="text-blue-600">BuzzMe</span>
                </h1>
                <p className="text-lg text-gray-600">
                  Select a co-worker or a channel to start a conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAppTesting;

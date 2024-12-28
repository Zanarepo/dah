import React, { useState } from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai"; // Arrow icons
import ChatBox from "../profile/ChatboxTesting";
import EmployeeChatUI from "../Chat/EmployeeChatUI"; // Redesigned chat UI component
import QuickActionPopup from "./QuickActionPopup";
import ChannelChatBox from "../Chat/ChannelChatBox"; // Assuming this is the channel chat box

const ChatAppTesting = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null); // Track selected channel
  const [isVisible, setIsVisible] = useState(true); // For mobile view toggle

  const handleSelectChat = (user) => {
    setSelectedUser(user);
    setSelectedChannel(null); // Deselect any channel when selecting a user

    // Automatically hide the chat list on mobile after selecting a user
    if (window.innerWidth < 768) {
      setIsVisible(false);
    }
  };

  const handleSelectChannel = (channelId) => {
    setSelectedChannel(channelId);
    setSelectedUser(null); // Deselect any user when selecting a channel

    // Automatically hide the chat list on mobile after selecting a channel
    if (window.innerWidth < 768) {
      setIsVisible(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
      {/* Quick Action Popup (Fixed on top) */}
      <QuickActionPopup />

      {/* Sidebar with Chat List */}
      <div
        className={`transition-all duration-300 ${
          isVisible ? "w-80" : "w-0"
        } bg-gray-800 text-white overflow-y-auto md:w-80 md:h-full z-10`}
      >
        {isVisible && (
          <div className="h-full">
            <EmployeeChatUI onSelectChat={handleSelectChat} onSelectChannel={handleSelectChannel} />
          </div>
        )}
      </div>

      {/* Chat Box Area */}
      <div className={`flex-1 ${isVisible ? "hidden md:block" : "w-full"}`}>
        <div className="relative h-screen">
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute top-4 left-4 md:hidden z-20 bg-blue-500 text-white px-3 py-2 rounded-md shadow-md"
          >
            {isVisible ? <AiOutlineLeft size={24} /> : <AiOutlineRight size={24} />}
          </button>

          {/* Show Channel Chat Box if a channel is selected */}
          {selectedChannel ? (
            <ChannelChatBox
              channelId={selectedChannel}
              onClose={() => setSelectedChannel(null)} // Close the channel chat when done
            />
          ) : selectedUser ? (
            // Show Direct Chat Box if a user is selected
            <ChatBox selectedUser={selectedUser} />
          ) : (
            // Placeholder Welcome Message if no chat or channel is selected
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
                  Select a co-worker or a channel to start a conversation
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

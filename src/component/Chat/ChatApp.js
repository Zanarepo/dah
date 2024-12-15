import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectChat = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <ChatList onSelectChat={handleSelectChat} />
      </div>
      <div className="w-3/4 bg-gray-100">
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a user to start a conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;

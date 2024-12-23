import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading] = useState(true);









  useEffect(() => {
    if (!selectedUser) return;
  
    console.log("Setting up subscription for user:", selectedUser);
  
    const subscription = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new;
          console.log("Real-time message received:", newMessage);
  
          if (
            (newMessage.sender === localStorage.getItem("employee_id") &&
              newMessage.receiver === selectedUser.employee_id) ||
            (newMessage.receiver === localStorage.getItem("employee_id") &&
              newMessage.sender === selectedUser.employee_id)
          ) {
            setMessages((prevMessages) => {
              // Prevent duplicates by checking if the message already exists
              if (prevMessages.some((msg) => msg.id === newMessage.id)) {
                return prevMessages;
              }
              return [...prevMessages, newMessage];
            });
          }
        }
      )
      .subscribe();
  
    // Cleanup to avoid duplicate subscriptions
    return () => {
      console.log("Cleaning up subscription for user:", selectedUser);
      supabase.removeChannel(subscription);
    };
  }, [selectedUser]);
  


  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        sender: localStorage.getItem("employee_id"),
        receiver: selectedUser.employee_id,
        message: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex items-center p-4 bg-blue-500 text-white">
        <h3 className="text-lg font-semibold">
          {selectedUser.first_name} {selectedUser.last_name}
        </h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {loading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`p-2 rounded-md ${
                  msg.sender === localStorage.getItem("employee_id")
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                {msg.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 bg-gray-100">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-150"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

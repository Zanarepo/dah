import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ActiveChatBox = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const loggedInEmployeeId = localStorage.getItem("employee_id"); // Retrieve employee_id from local storage

  useEffect(() => {
    if (!selectedChat || !loggedInEmployeeId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("direct_chats")
        .select("sender_id, receiver_id, message, created_at") // Fetch message column
        .or(`sender_id.eq.${loggedInEmployeeId},receiver_id.eq.${loggedInEmployeeId}`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [selectedChat, loggedInEmployeeId]);

  const sendMessage = async () => {
    if (!messageContent.trim()) {
      console.log("Message content is empty. Not sending.");
      return; // Prevent sending empty messages
    }
  
    if (!loggedInEmployeeId) {
      console.error("Error: Missing sender_id.");
      return;
    }
  
    if (!selectedChat || !selectedChat.receiver_id) {
      console.error("Error: Missing receiver_id in selectedChat.");
      return;
    }
  
    const newMessage = {
      sender_id: loggedInEmployeeId,
      receiver_id: selectedChat.receiver_id,
      message: messageContent,
      is_read: false, // Default value
    };
  
    console.log("Sending message with payload:", newMessage);
  
    // Insert the new message into the table
    const { data, error } = await supabase.from("direct_chats").insert([newMessage]);
  
    if (error) {
      // Log the error details
      console.error("Error sending message:", error);
      console.error("Supabase Error Details:", error.details);
      console.error("Supabase Error Hint:", error.hint);
      return;
    }
  
    if (data && data.length > 0) {
      // Log the inserted data
      console.log("Message inserted successfully:", data);
      setMessages([...messages, data[0]]);
    } else {
      // Log the case where no data is returned
      console.error("Error: No data returned from insert. Response data:", data);
    }
  
    setMessageContent(""); // Clear the input field
  
  
  
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender_id === loggedInEmployeeId ? "text-right" : "text-left"
            }`}
          >
            <div className="inline-block bg-blue-500 text-white rounded-lg px-3 py-2">
              {msg.message} {/* Use message field here */}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-200 flex items-center">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ActiveChatBox;

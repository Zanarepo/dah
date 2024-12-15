import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
//import FileUpload from './FileUpload'; 
//import { FaRegSmile, FaPaperPlane } from 'react-icons/fa';

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = parseInt(localStorage.getItem("employee_id"), 10);
  //const [showFileUpload, setShowFileUpload] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setError(null);
      try {
        const { data, error } = await supabase
          .from("direct_chats")
          .select("*")
          .or(
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.employee_id}),and(sender_id.eq.${selectedUser.employee_id},receiver_id.eq.${currentUserId})`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (fetchError) {
        console.error("Error fetching messages:", fetchError);
        setError("Failed to fetch messages. Please try again.");
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel("realtime:direct_chats")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_chats" },
        (payload) => {
          const newMessage = payload.new;
          if (
            newMessage &&
            ((parseInt(newMessage.sender_id, 10) === currentUserId &&
              parseInt(newMessage.receiver_id, 10) === selectedUser.employee_id) ||
              (parseInt(newMessage.sender_id, 10) === selectedUser.employee_id &&
                parseInt(newMessage.receiver_id, 10) === currentUserId))
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "direct_chats" },
        (payload) => {
          const updatedMessage = payload.new;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id
                ? { ...msg, is_read: updatedMessage.is_read }
                : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedUser, currentUserId]);

  // Check if user is online (simulated here for demonstration)
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Simulate checking user status from a 'users' table or similar
        const { data, error } = await supabase
          .from("users")
          .select("is_online")
          .eq("employee_id", selectedUser.employee_id)
          .single();
        
        if (error) throw error;
        setIsUserOnline(data?.is_online);
      } catch (statusError) {
        console.error("Error checking user status:", statusError);
      }
    };

    checkUserStatus();
  }, [selectedUser]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
  
    setIsSending(true);
    const messageContent = newMessage.trim();
  
    try {
      const { error } = await supabase.from("direct_chats").insert([{
        sender_id: currentUserId,
        receiver_id: selectedUser.employee_id,
        message: messageContent,
        status: "sent", // Initially mark message as sent
      }]);
  
      if (error) throw error;
  
      setMessages((prev) => [
        ...prev,
        {
          sender_id: currentUserId,
          receiver_id: selectedUser.employee_id,
          message: messageContent,
          status: "sent", // Mark message as sent
          created_at: new Date().toISOString(),
        },
      ]);
  
      // Scroll to the bottom after sending a message
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  
    } catch (sendError) {
      console.error("Error sending message:", sendError);
      setError("Failed to send message. Please try again.");
    } finally {
      setNewMessage("");
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full p-4 bg-gray-50 border-l border-gray-300 dark:bg-gray-800 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isUserOnline ? 'bg-blue-500' : 'bg-gray-400'}`}
          />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {selectedUser.first_name} {selectedUser.last_name}
          </h2>
        </div>
        <img
          src={`https://ui-avatars.com/api/?name=${selectedUser.first_name}+${selectedUser.last_name}`}
          alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
          className="w-10 h-10 rounded-full"
        />
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-500 dark:text-red-400">
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 mb-4 border-b border-gray-200 dark:border-gray-500">
        {messages.map((msg, index) => {
          const isCurrentUser = parseInt(msg.sender_id, 10) === currentUserId;
          return (
            <div
              key={index}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
                }`}
              >
                <p>{msg.message}</p>
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                  <span>{msg.status === "sent" ? "•" : msg.status === "delivered" ? "••" : ""}</span>
                  <span>{msg.status === "sent" ? "Sent" : msg.status === "delivered" ? "Delivered" : ""}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <button
          onClick={sendMessage}
          disabled={isSending}
          className={`ml-2 px-4 py-2 text-sm font-semibold text-white rounded-lg ${
            isSending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
          }`}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

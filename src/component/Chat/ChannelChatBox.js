import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CryptoJS from "crypto-js";
import EmployeeChannelManager from "../Chat/EmployeeChannelManager";


const SECRET_KEY = "your_secret_key_here"; // Replace with your secret key

const ChannelChatBox = ({ channelId, channelName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [employees, setEmployees] = useState({});
  const messagesEndRef = useRef(null);

  const currentUserId = parseInt(localStorage.getItem("employee_id"), 10);
  const [showEmployeeChannelManager, setEmployeeChannelManager] = useState(false);

  const encryptMessage = (message) =>
    CryptoJS.AES.encrypt(message, SECRET_KEY).toString();

  const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Fetching employees and messages
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("channel_chats")
          .select("*")
          .eq("channel_id", channelId)
          .order("timestamp", { ascending: true });

        if (error) throw error;

        const decryptedMessages = data.map((msg) => ({
          ...msg,
          message: decryptMessage(msg.message),
        }));

        if (isMounted) {
          setMessages(decryptedMessages || []);
        }
      } catch (fetchError) {
        console.error("Error fetching channel messages:", fetchError);
      }
    };

    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from("employee_profiles")
          .select("employee_id, first_name, last_name");

        if (error) throw error;

        const employeeMap = data.reduce((acc, employee) => {
          acc[employee.employee_id] = `${employee.first_name} ${employee.last_name}`;
          return acc;
        }, {});

        if (isMounted) {
          setEmployees(employeeMap);
        }
      } catch (fetchError) {
        console.error("Error fetching employees:", fetchError);
      }
    };

    fetchMessages();
    fetchEmployees();

    const subscription = supabase
      .channel(`realtime:channel_chats:${channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "channel_chats" },
        (payload) => {
          const newMessage = payload.new;
          newMessage.message = decryptMessage(newMessage.message);

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, [channelId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending || !currentUserId) {
      return;
    }
  
    setIsSending(true);
    const encryptedMessage = encryptMessage(newMessage.trim());
  
    try {
      const { error } = await supabase.from("channel_chats").insert([
        {
          channel_id: channelId,
          sender_id: currentUserId,
          message: encryptedMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
  
      if (error) throw error;
      
      // Reset the input field after sending
      setNewMessage("");
    } catch (sendError) {
      console.error("Error sending message:", sendError);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div
      className="flex flex-col h-full p-4 bg-gray-50 border-l border-gray-300 dark:bg-gray-800 dark:border-gray-600 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Channel Name at the Top */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {channelName}
        </h2>
        <div className="flex items-center gap-2">
          {/* Toggle Manage Members Button */}
          <button
            onClick={() => setEmployeeChannelManager((prev) => !prev)}
            className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600"
          >
            {showEmployeeChannelManager ? "Close Members" : "Manage Members"}
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
  
      {/* Manage Channel Members Section */}
      {showEmployeeChannelManager && (
        <EmployeeChannelManager
          channelId={channelId}
          onUpdateMembers={() => console.log("Channel members updated!")}
        />
      )}
  
      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-2 mb-4 border-b border-gray-200 dark:border-gray-500">
        {messages.map((msg, index) => {
          const isCurrentUser = parseInt(msg.sender_id, 10) === currentUserId;
          const senderName = employees[msg.sender_id] || "Unknown User";
          return (
            <div
              key={index}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {/* Display sender name in a lighter color */}
                <p className="font-semibold text-sm text-gray-500 dark:text-gray-300">
                  {senderName}
                </p>
                <p>{msg.message}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
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

export default ChannelChatBox;

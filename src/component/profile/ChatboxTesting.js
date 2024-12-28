import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CryptoJS from "crypto-js"; // Import CryptoJS for encryption and decryption

const SECRET_KEY = "your_secret_key_here"; // Define your secret key for encryption

const ChatboxTestint = ({ selectedUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = parseInt(localStorage.getItem("employee_id"), 10);
  const [isUserOnline] = useState(false);

  // Encrypt message
  const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  };

  // Decrypt message
  const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8); // Convert bytes to string
  };

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

        // Decrypt messages before setting them
        const decryptedMessages = data.map((msg) => ({
          ...msg,
          message: decryptMessage(msg.message),
        }));

        setMessages(decryptedMessages || []);
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

          // Decrypt new message before adding it
          newMessage.message = decryptMessage(newMessage.message);

          // Prevent duplicate messages by checking if the message already exists
          if (
            newMessage &&
            !messages.some(
              (msg) =>
                msg.id === newMessage.id ||
                (msg.sender_id === newMessage.sender_id &&
                  msg.receiver_id === newMessage.receiver_id &&
                  msg.message === newMessage.message)
            ) &&
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
          updatedMessage.message = decryptMessage(updatedMessage.message); // Decrypt updated message
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
  }, [selectedUser, currentUserId, messages]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const encryptedMessage = encryptMessage(newMessage.trim()); // Encrypt the message before sending

    try {
      const { error } = await supabase.from("direct_chats").insert([{
        sender_id: currentUserId,
        receiver_id: selectedUser.employee_id,
        message: encryptedMessage, // Save the encrypted message
        status: "", // Initially mark message as sent
      }]);

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        {
          sender_id: currentUserId,
          receiver_id: selectedUser.employee_id,
          message: newMessage.trim(),
          status: "sent", // Mark message as sent
          created_at: new Date().toISOString(),
        },
      ]);

      // Scroll to the bottom after sending a message
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    } catch (sendError) {
      console.error("Error sending message:", sendError);
      setError("Failed to send message. Please try again.");
    } finally {
      setNewMessage("");
      setIsSending(false);
    }
  };

  // Handle profile picture click
  const handleProfilePictureClick = () => {
    setShowProfileModal(true);
  };

  // Close the profile modal
  const handleCloseModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div
      className="flex flex-col h-full p-4 bg-gray-50 border-l border-gray-300 dark:bg-gray-800 dark:border-gray-600 max-w-full sm:max-w-lg md:max-w-md lg:max-w-lg xl:max-w-3xl mx-auto overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside
    >
      {/* Profile Picture Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full mx-4">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <img
              src={selectedUser.profile_picture || `https://ui-avatars.com/api/?name=${selectedUser.first_name}+${selectedUser.last_name}`}
              alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isUserOnline ? 'bg-blue-500' : 'bg-gray-400'}`}
          />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {selectedUser.first_name} {selectedUser.last_name}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src={selectedUser.profile_picture || `https://ui-avatars.com/api/?name=${selectedUser.first_name}+${selectedUser.last_name}`}
            alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={handleProfilePictureClick}
          />
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
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
                  {isCurrentUser && msg.status === "sent" && (
                    <span className="text-green-500">✔</span>
                  )}
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

export default ChatboxTestint;

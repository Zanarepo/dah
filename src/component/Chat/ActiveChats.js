import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";

const ActiveChats = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const employeeId = localStorage.getItem("employee_id");

  // Fetch active chats
  const fetchActiveChats = useCallback(async () => {
    if (!employeeId) return; // Ensure employee_id exists
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("direct_chats")
        .select("id, sender_id, receiver_id, created_at")
        .or(`sender_id.eq.${employeeId},receiver_id.eq.${employeeId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentChats = data.filter((chat) => {
        const chatDate = new Date(chat.created_at);
        return chatDate >= sevenDaysAgo;
      });

      setActiveChats(recentChats);
    } catch (err) {
      console.error("Error fetching active chats:", err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  // Fetch messages for a specific chat
  const fetchMessages = async (chatId) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, message, created_at")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Handle selecting a chat
  const handleChatClick = (chat) => {
    if (selectedChat?.id === chat.id) {
      setSelectedChat(null);
      setMessages([]);
    } else {
      setSelectedChat(chat);
      fetchMessages(chat.id);
    }
  };

  // Handle sending a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !employeeId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: selectedChat.id,
            sender_id: employeeId,
            receiver_id:
              selectedChat.sender_id === employeeId
                ? selectedChat.receiver_id
                : selectedChat.sender_id,
            message: newMessage,
          },
        ]);

      if (error) throw error;

      setMessages((prev) => [...prev, data[0]]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchActiveChats();

    const interval = setInterval(() => {
      fetchActiveChats();
    }, 60000); // Refresh chats every 1 minute

    return () => clearInterval(interval);
  }, [fetchActiveChats]);

  return (
    <div className="active-chats-section p-4">
      <h3 className="text-xl font-bold mb-4">Active Chats</h3>

      {loading ? (
        <p>Loading active chats...</p>
      ) : activeChats.length === 0 ? (
        <p className="text-gray-500">No active chats in the last 7 days.</p>
      ) : (
        <ul>
          {activeChats.map((chat) => (
            <li key={chat.id} className="border-b pb-4 mb-4">
              <div
                className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleChatClick(chat)}
              >
                <div>
                  <p>
                    Chat between:{" "}
                    <span className="font-semibold">
                      {chat.sender_id} ↔ {chat.receiver_id}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(chat.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedChat?.id === chat.id && (
                <div className="chatbox mt-2 border p-2 rounded bg-gray-50">
                  <div className="messages max-h-64 overflow-y-auto">
                    {messages.length === 0 ? (
                      <p className="text-gray-500">No messages yet.</p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`message p-2 mb-2 rounded ${
                            msg.sender_id === employeeId
                              ? "bg-blue-100 self-end"
                              : "bg-gray-200"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="input-section mt-2 flex">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-grow p-2 border rounded"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={sendMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveChats;

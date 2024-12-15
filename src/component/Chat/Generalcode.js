import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("employee_id");

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
            ((newMessage.sender_id === currentUserId &&
              newMessage.receiver_id === selectedUser.employee_id) ||
              (newMessage.sender_id === selectedUser.employee_id &&
                newMessage.receiver_id === currentUserId))
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedUser, currentUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const messageContent = newMessage.trim();
    setIsSending(true);

    const newMessageObj = {
      sender_id: currentUserId,
      receiver_id: selectedUser.employee_id,
      message: messageContent,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessageObj]);

    try {
      const { error } = await supabase.from("direct_chats").insert([{
        sender_id: currentUserId,
        receiver_id: selectedUser.employee_id,
        message: messageContent,
      }]);

      if (error) throw error;
    } catch (sendError) {
      console.error("Error sending message:", sendError);
      setError("Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((msg) => msg !== newMessageObj)); 
    } finally {
      setNewMessage("");
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-gray-50 rounded-lg shadow">
      <div className="border-b pb-2 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 truncate">
          Chat with {selectedUser.first_name} {selectedUser.last_name}
        </h2>
        <span className="text-gray-400 text-sm">
          Employee ID: {selectedUser.employee_id}
        </span>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 p-2 bg-white rounded-lg shadow-inner">
        <div className="flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${
                  msg.sender_id === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } max-w-[75%] px-4 py-2 rounded-lg shadow-md`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {isTyping && (
        <div className="text-gray-500 text-sm mt-2">User is typing...</div>
      )}

      <div className="mt-4 flex flex-col md:flex-row items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message"
          id="message-input"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={sendMessage}
          className={`px-4 py-2 mt-2 md:mt-0 rounded-lg focus:outline-none focus:ring ${isSending ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;




import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ChatList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const currentUserId = localStorage.getItem("employee_id");  // Get the current logged-in user ID

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("employee_id, first_name, last_name");

      if (error) {
        console.error(error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700">Employees</h2>
      {users.map((user) => (
        // Skip the current user from being displayed in the chat list
        user.employee_id !== currentUserId && (
          <div
            key={user.employee_id}
            className="flex items-center p-3 bg-white rounded-md shadow-sm hover:bg-gray-200 cursor-pointer"
            onClick={() => onSelectUser(user)}
          >
            {/* Initials */}
            <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold mr-4">
              {user.first_name[0]}
              {user.last_name[0]}
            </div>
            {/* User Name */}
            <div>
              <p className="font-semibold text-gray-800">
                {user.first_name} {user.last_name}
                {/* Display "Me" if it's the logged-in user */}
                {user.employee_id === currentUserId && (
                  <span className="text-gray-400 text-sm ml-2">(Me)</span>
                )}
              </p>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default ChatList;




import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import ChatBox from "./ChatBox";

const ChatApp = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("employee_profiles").select("*");
      if (!error) setEmployees(data);
    };

    fetchEmployees();

    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) setSelectedUser(JSON.parse(savedUser));

    const fetchRecentChats = async () => {
      const { data, error } = await supabase
        .from("direct_chats")
        .select("sender_id, receiver_id, created_at")
        .order("created_at", { ascending: false });

      if (!error) {
        const uniqueChats = data.reduce((acc, chat) => {
          const chatPartnerId =
            chat.sender_id === localStorage.getItem("employee_id")
              ? chat.receiver_id
              : chat.sender_id;

          if (!acc.some((c) => c.partner_id === chatPartnerId)) {
            acc.push({ partner_id: chatPartnerId, created_at: chat.created_at });
          }
          return acc;
        }, []); 
        setRecentChats(uniqueChats);
      }
    };

    fetchRecentChats();

    const subscription = supabase
      .channel("table_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_chats" },
        (payload) => {
          const newChat = payload.new;

          const chatPartnerId =
            newChat.sender_id === localStorage.getItem("employee_id")
              ? newChat.receiver_id
              : newChat.sender_id;

          setRecentChats((prev) => {
            const isAlreadyActive = prev.some((chat) => chat.partner_id === chatPartnerId);
            if (!isAlreadyActive) {
              return [
                { partner_id: chatPartnerId, created_at: newChat.created_at },
                ...prev,
              ].slice(0, 5);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));

    const newChat = {
      partner_id: user.employee_id,
      created_at: new Date().toISOString(),
    };

    setRecentChats((prev) => {
      const isAlreadyActive = prev.some((chat) => chat.partner_id === user.employee_id);
      if (!isAlreadyActive) {
        return [newChat, ...prev].slice(0, 5); 
      }
      return prev;
    });
  };

  const handleScroll = () => {
    if (chatMessagesRef.current) {
      const isBottom =
        chatMessagesRef.current.scrollHeight ===
        chatMessagesRef.current.scrollTop + chatMessagesRef.current.clientHeight;
      setIsAtBottom(isBottom);
      setShowScrollButton(!isBottom);
    }
  };

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      setIsAtBottom(true);
      setShowScrollButton(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Active Chats Section */}
      <div className="flex-1 flex flex-col p-4 h-full md:w-3/4">
        <div className="w-full mb-4">
          <h2 className="text-lg font-semibold">Active Chats</h2>
          <div className="flex space-x-4 overflow-x-auto">
            {recentChats.map((chat, index) => {
              const employee = employees.find((emp) => emp.employee_id === chat.partner_id);

              if (!employee) return null;

              return (
                <div
                  key={index}
                  onClick={() => handleSelectUser(employee)}
                  className="p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
                      {employee.first_name ? `${employee.first_name[0]}${employee.last_name[0]}` : ""}
                    </div>
                    <span className="truncate text-xs">
                      {employee?.first_name} {employee?.last_name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chatbox */}
        <div className="flex-1 flex flex-col p-4 relative overflow-hidden">
          {selectedUser ? (
            <ChatBox
              selectedUser={selectedUser}
              currentUserId={localStorage.getItem("employee_id")}
            />
          ) : (
            <div className="text-gray-500">Select an employee to start chatting</div>
          )}

          {/* Scroll Button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg"
            >
              ⬇️
            </button>
          )}
        </div>
      </div>

      {/* Employee List Sidebar */}
      <div className="md:w-1/4 w-full bg-white border-l md:border-l-0 overflow-y-auto md:h-full h-1/2 md:block flex-shrink-0">
        <h2 className="text-lg font-bold p-4 border-b bg-gray-50 md:sticky top-0">
          Employees
        </h2>
        <ul className="p-4 space-y-2">
          {employees.map((employee) => (
            <li
              key={employee.employee_id}
              onClick={() => handleSelectUser(employee)}
              className={`p-2 rounded-lg cursor-pointer ${
                selectedUser?.employee_id === employee.employee_id
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                  {employee.first_name ? employee.first_name[0] : ""}
                </div>
                <span className="truncate">{`${employee.first_name} ${employee.last_name}`}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatApp;

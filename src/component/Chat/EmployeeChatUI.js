import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Supabase client
import ChatListTesting from "../profile/ChatListTesting"; // Replace the employee list with ChatListTesting
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Icons for dropdown arrows

const EmployeeChatUI = ({ onSelectChat }) => {
  const [channels, setChannels] = useState([]);
  const [employeesVisible, setEmployeesVisible] = useState(false);
  const [channelsVisible, setChannelsVisible] = useState(false);
  const [activeChatsVisible, setActiveChatsVisible] = useState(false);
  const [activeChats, setActiveChats] = useState([]);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchChannels = async () => {
      const { data, error } = await supabase
        .from("department_chat_channels")
        .select("channel_id, channel_name");
      if (error) console.log(error);
      else setChannels(data);
    };

    const fetchActiveChats = async () => {
      const { data, error } = await supabase
        .from("direct_chats") // Assuming you have a table for direct chats
        .select("chat_id, chat_name");
      if (error) console.log(error);
      else setActiveChats(data);
    };

    fetchChannels();
    fetchActiveChats();
  }, []);

  return (
    <div
      className="h-full bg-gray-800 text-white p-4 overflow-y-auto 
      md:w-48 md:h-full md:fixed md:top-0 md:left-0
      w-64 h-screen fixed top-0 left-0 z-50"
    >
      {/* Active Chats Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setActiveChatsVisible(!activeChatsVisible)}
        >
          <h2 className="text-lg font-semibold">Active Chats</h2>
          {activeChatsVisible ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {activeChatsVisible && (
          <div className="mt-2">
            {activeChats.map((chat) => (
              <div
                key={chat.chat_id}
                className="p-2 border-b cursor-pointer hover:bg-gray-700"
              >
                {chat.chat_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Channels Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setChannelsVisible(!channelsVisible)}
        >
          <h2 className="text-lg font-semibold">Chat Channels</h2>
          {channelsVisible ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {channelsVisible && (
          <div className="mt-2">
            {channels.map((channel) => (
              <div
                key={channel.channel_id}
                className="p-2 border-b cursor-pointer hover:bg-gray-700"
              >
                {channel.channel_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employees Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setEmployeesVisible(!employeesVisible)}
        >
          <h2 className="text-lg font-semibold">Employees</h2>
          {employeesVisible ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {employeesVisible && (
          <div className="mt-2">
            <ChatListTesting onSelectChat={onSelectChat} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeChatUI;

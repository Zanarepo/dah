import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import ChatListTesting from "../profile/ChatListTesting";
import CreateChannelPage from "../Chat/CreateChannelPage"
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa"; 

const EmployeeChatUI = ({ onSelectChat, onSelectChannel }) => {
  const [channels, setChannels] = useState([]);
  const [employeesVisible, setEmployeesVisible] = useState(false);
  const [channelsVisible, setChannelsVisible] = useState(false);
  const [activeChatsVisible, setActiveChatsVisible] = useState(false);
  const [activeChats, setActiveChats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 

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
        .from("direct_chats")
        .select("id");
      if (error) console.log(error);
      else setActiveChats(data);
    };

    fetchChannels();
    fetchActiveChats();
  }, []);

  const handleCreateChannel = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="h-screen bg-gray-800 text-white p-4 md:w-80 w-64 fixed top-0 left-0 z-50 overflow-hidden">
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
                onClick={() => onSelectChat(chat.chat_id)} 
              >
                {chat.chat_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Channels Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center cursor-pointer">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Chat Channels</h2>
            <button
              onClick={handleCreateChannel}
              className="ml-2 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <FaPlus size={12} />
            </button>
          </div>
          <div onClick={() => setChannelsVisible(!channelsVisible)}>
            {channelsVisible ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        {channelsVisible && (
          <div className="mt-2">
            {channels.map((channel) => (
              <div
                key={channel.channel_id}
                className="p-2 border-b cursor-pointer hover:bg-gray-700"
                onClick={() => onSelectChannel(channel.channel_id)} 
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

      {/* Modal for Creating Channel */}
      {isModalOpen && <CreateChannelPage closeModal={closeModal} />}
    </div>
    
  );
};

export default EmployeeChatUI;

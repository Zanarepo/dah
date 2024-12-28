import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import ChannelChatBox from "./ChannelChatBox";  // Import the ChannelChatBox component

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    // Fetch the channels from Supabase
    const fetchChannels = async () => {
      try {
        const { data, error } = await supabase
          .from("department_chat_channels")
          .select("*");

        if (error) {
          console.error("Error fetching channels:", error);
          return;
        }
        setChannels(data);
      } catch (err) {
        console.error("Error fetching channels:", err);
      }
    };

    fetchChannels();
  }, []);

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Available Channels</h2>
      <div className="space-y-2">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => handleChannelClick(channel)}
            className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            #{channel.name}
          </button>
        ))}
      </div>

      {selectedChannel && (
        <ChannelChatBox
          channelId={selectedChannel.id}
          channelName={selectedChannel.name}
          onClose={() => setSelectedChannel(null)}  // Close the chat box when done
        />
      )}
    </div>
  );
};

export default ChannelList;

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you are using Supabase
import { toast } from "react-toastify"; // Importing react-toastify for toasts
import "react-toastify/dist/ReactToastify.css"; // Importing styles

const DeleteChannelPage = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetching all channels from the department_chat_channels table
  useEffect(() => {
    const fetchChannels = async () => {
      const { data, error } = await supabase.from("department_chat_channels").select("channel_id, channel_name");
      if (error) {
        toast.error("Failed to load channels.");
      } else {
        setChannels(data);
      }
    };

    fetchChannels();
  }, []);

  // Handle channel deletion
  const handleDeleteChannel = async () => {
    if (!selectedChannel) {
      toast.error("Please select a channel to delete.");
      return;
    }

    setLoading(true);

    // Ensure the channel_id is an integer before proceeding
    const channelId = parseInt(selectedChannel, 10);

    // Log the parsed channel_id to debug
    console.log("Parsed Channel ID:", channelId);

    // If the channelId is not a valid number, show an error
    if (isNaN(channelId)) {
      toast.error("Invalid channel ID.");
      setLoading(false);
      return;
    }

    // Deleting the selected channel from the database
    const { error } = await supabase
      .from("department_chat_channels")
      .delete()
      .eq("channel_id", channelId);

    if (error) {
      toast.error("Failed to delete channel.");
    } else {
      toast.success("Channel deleted successfully.");
      setSelectedChannel(""); // Reset selected channel
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start bg-white p-4 m-0 min-h-screen">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl sm:w-full sm:max-w-md mt-0 shadow-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Delete Department Chat Channel</h2>

        {/* Channel Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Channel</label>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Channel</option>
            {channels.map((channel) => (
              <option key={channel.channel_id} value={channel.channel_id}>
                {channel.channel_name} {/* Display channel name */}
              </option>
            ))}
          </select>
        </div>

        {/* Delete Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleDeleteChannel}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChannelPage;

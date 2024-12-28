import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you are using Supabase
import { toast } from "react-toastify"; // Importing react-toastify for toasts
import "react-toastify/dist/ReactToastify.css"; // Importing styles

const DeleteChannelPage = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal visibility
  const [channelToDelete, setChannelToDelete] = useState(""); // Store the channel to be deleted

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

    // Open the confirmation modal
    setIsModalOpen(true);
    setChannelToDelete(selectedChannel);
  };

  const confirmDelete = async () => {
    if (!channelToDelete) {
      toast.error("No channel selected for deletion.");
      return;
    }

    // Ensure the channel_id is an integer before proceeding
    const channelId = parseInt(channelToDelete, 10);

    // Log the parsed channel_id to debug
    console.log("Parsed Channel ID:", channelId);

    // If the channelId is not a valid number, show an error
    if (isNaN(channelId)) {
      toast.error("Invalid channel ID.");
      return;
    }

    setLoading(true);

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
      setChannelToDelete(""); // Reset channel to delete
    }

    setLoading(false);
    setIsModalOpen(false); // Close the modal after deletion
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // Close the modal without deleting
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal in case of failure or manual close
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full sm:w-96">
        <h2 className="text-xl font-bold mb-4">Delete Department Chat Channel</h2>

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
        <div className="flex justify-between items-center">
          <button
            onClick={handleDeleteChannel}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            {loading ? "Deleting..." : "Delete Channel"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4 text-sm">Are you sure you want to delete this channel?</p>
            <div className="flex justify-between items-center">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2"
              >
                Cancel
              </button>
            </div>
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteChannelPage;

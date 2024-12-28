import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Use your Supabase client

const CreateChannelModal = ({ departmentId, onClose, refreshChannels }) => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  // Fetch employees in the department
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("id, first_name, last_name")
        .eq("department_id", departmentId);

      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        setAllEmployees(data);
      }
    };

    fetchEmployees();
  }, [departmentId]);

  // Create the channel
  const handleCreateChannel = async () => {
    try {
      // Insert channel details
      const { data: channelData, error: channelError } = await supabase
        .from("department_chat_channels")
        .insert([
          {
            department_id: departmentId,
            channel_name: channelName,
            description,
            created_by: localStorage.getItem("employee_id"), // Assuming admin ID is stored in local storage
          },
        ])
        .select();

      if (channelError) throw channelError;

      const channelId = channelData[0].channel_id;

      // Insert selected members into channel_members
      if (selectedMembers.length > 0) {
        const members = selectedMembers.map((memberId) => ({
          channel_id: channelId,
          employee_id: memberId,
        }));

        const { error: memberError } = await supabase
          .from("channel_members")
          .insert(members);

        if (memberError) throw memberError;
      }

      onClose(); // Close the modal
      refreshChannels(); // Refresh the list of channels
      alert("Channel created successfully!");
    } catch (err) {
      console.error("Error creating channel:", err);
      alert("Failed to create channel.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Create Channel</h2>

        {/* Channel Name Input */}
        <input
          type="text"
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {/* Description Input */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        ></textarea>

        {/* Member Selection */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Select Members</h4>
          <select
            multiple
            value={selectedMembers}
            onChange={(e) =>
              setSelectedMembers(
                Array.from(e.target.selectedOptions, (option) =>
                  parseInt(option.value)
                )
              )
            }
            className="w-full border p-2 rounded"
          >
            {allEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateChannel}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;

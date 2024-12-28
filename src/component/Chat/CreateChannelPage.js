import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you are using Supabase
import { toast } from "react-toastify"; // Importing react-toastify for toasts
import "react-toastify/dist/ReactToastify.css"; // Importing styles

const DepartmentChatPage = ({ closeModal }) => {  // CloseModal is passed as a prop
  const [departments, setDepartments] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetching departments from the `departments` table
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("id, name");
      if (error) {
        toast.error("Failed to load departments.");
      } else {
        setDepartments(data);
      }
    };

    fetchDepartments();
  }, []);

  // Handling channel creation
  const handleCreateChannel = async () => {
    if (!selectedDepartment || !channelName || !channelDescription) {
      toast.error("Please fill out all fields.");
      return;
    }

    const employeeId = localStorage.getItem("employee_id"); // Retrieve employee_id from local storage
    if (!employeeId) {
      toast.error("User not logged in.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("department_chat_channels")
      .insert([{
        department_id: selectedDepartment,
        channel_name: channelName,
        description: channelDescription,
        created_by: employeeId, // Add employee_id to created_by field
      }]);

    if (error) {
      toast.error("Failed to create channel.");
    } else {
      toast.success("Channel created successfully.");
      setChannelName("");
      setChannelDescription("");
      setSelectedDepartment("");
      closeModal(); // Close modal after successful creation
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full sm:w-96">
        <h2 className="text-xl font-bold mb-4">Create Department Chat Channel</h2>

        {/* Department Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Select Department"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Channel Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Channel Name</label>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter channel name"
          />
        </div>

        {/* Channel Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Channel Description</label>
          <textarea
            value={channelDescription}
            onChange={(e) => setChannelDescription(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter channel description"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleCreateChannel}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? "Creating..." : "Create Channel"}
          </button>
          <button
            onClick={closeModal}  // Ensure this calls the parent closeModal
            className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentChatPage;

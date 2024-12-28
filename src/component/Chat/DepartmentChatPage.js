import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you are using Supabase
import { toast } from "react-toastify"; // Importing react-toastify for toasts
import "react-toastify/dist/ReactToastify.css"; // Importing styles

const DepartmentChatPage = () => {
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

    const {  error } = await supabase
      .from("department_chat_channels")
      .insert([
        {
          department_id: selectedDepartment,
          channel_name: channelName,
          description: channelDescription,
          created_by: employeeId, // Add employee_id to created_by field
        },
      ]);

    if (error) {
      toast.error("Failed to create channel.");
    } else {
      toast.success("Channel created successfully.");
      setChannelName("");
      setChannelDescription("");
      setSelectedDepartment("");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Create Department Chat Channel</h2>

      {/* Department Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Department</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
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
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Channel Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Channel Description</label>
        <textarea
          value={channelDescription}
          onChange={(e) => setChannelDescription(e.target.value)}
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleCreateChannel}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {loading ? "Creating..." : "Create Channel"}
      </button>
    </div>
  );
};

export default DepartmentChatPage;

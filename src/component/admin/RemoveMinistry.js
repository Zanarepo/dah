import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Adjust the import path based on your project structure
import { toast } from "react-toastify"; // Importing the toast notification library

const RemoveMinistry = () => {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  // Fetch ministries from the database
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const { data, error } = await supabase.from("ministries").select("*");
        if (error) throw error;
        setMinistries(data);
      } catch (error) {
        toast.error("Error fetching ministries: " + error.message); // Display error toast
      }
    };

    fetchMinistries();
  }, []);

  // Handle confirmation of deletion
  const handleDeleteMinistry = async () => {
    if (!selectedMinistry) {
      toast.error("Please select a ministry to delete."); // Error toast when no ministry is selected
      return;
    }

    try {
      // Delete the selected ministry from the "ministries" table
      const { error } = await supabase
        .from("ministries")
        .delete()
        .eq("id", selectedMinistry.id);

      if (error) throw error;

      toast.success("Ministry deleted successfully!"); // Success toast after deletion
      setConfirmationVisible(false); // Hide confirmation dialog
      setSelectedMinistry(null); // Reset selected ministry

      // Re-fetch ministries to update the list
      const { data } = await supabase.from("ministries").select("*");
      setMinistries(data);
    } catch (error) {
      toast.error("Error deleting ministry: " + error.message); // Error toast on failure
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Remove Ministry</h2>

      {/* Ministry Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Ministry to Delete</label>
        <select
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setSelectedMinistry(
              ministries.find((ministry) => ministry.id === parseInt(e.target.value))
            )
          }
          value={selectedMinistry ? selectedMinistry.id : ""}
        >
          <option value="">-- Select a Ministry --</option>
          {ministries.map((ministry) => (
            <option key={ministry.id} value={ministry.id}>
              {ministry.name}
            </option>
          ))}
        </select>
      </div>

      {/* Confirmation Popup */}
      {confirmationVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700">Are you sure you want to delete this ministry?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setConfirmationVisible(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMinistry}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Button */}
      <button
        onClick={() => setConfirmationVisible(true)}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-4"
      >
        Delete Ministry
      </button>
    </div>
  );
};

export default RemoveMinistry;

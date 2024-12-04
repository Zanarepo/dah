import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Adjust the import path based on your project structure

const RemoveMinistry = () => {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch ministries from the database
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const { data, error } = await supabase.from("ministries").select("*");
        if (error) throw error;
        setMinistries(data);
      } catch (error) {
        setErrorMessage("Error fetching ministries: " + error.message);
      }
    };

    fetchMinistries();
  }, []);

  // Handle confirmation of deletion
  const handleDeleteMinistry = async () => {
    if (!selectedMinistry) {
      setErrorMessage("Please select a ministry to delete.");
      return;
    }

    try {
      // Delete the selected ministry from the "ministries" table
      const { error } = await supabase
        .from("ministries")
        .delete()
        .eq("id", selectedMinistry.id);

      if (error) throw error;

      setSuccessMessage("Ministry deleted successfully!");
      setConfirmationVisible(false); // Hide confirmation dialog
      setSelectedMinistry(null); // Reset selected ministry
      setErrorMessage(""); // Reset error message

      // Re-fetch ministries to update the list
      const { data } = await supabase.from("ministries").select("*");
      setMinistries(data);
    } catch (error) {
      setErrorMessage("Error deleting ministry: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Remove Ministry</h2>

      {/* Success or Error Messages */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* Ministry Selection */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Ministry to Delete</label>
        <select
          className="w-full border border-gray-300 p-2 rounded"
          onChange={(e) => setSelectedMinistry(ministries.find(ministry => ministry.id === parseInt(e.target.value)))}
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

      {/* Show confirmation popup before deleting */}
      {confirmationVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this ministry?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setConfirmationVisible(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMinistry}
                className="bg-red-500 text-white px-4 py-2 rounded"
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
        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mt-4"
      >
        Delete Ministry
      </button>
    </div>
  );
};

export default RemoveMinistry;

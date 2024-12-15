import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify"; // Importing toastify for notifications
import Backfunction from "./Backfunction"; // Assuming Backfunction handles back navigation

const AddDepartment = () => {
  const [ministries, setMinistries] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [managerId, setManagerId] = useState("");

  // Fetch Ministries
  useEffect(() => {
    const fetchMinistries = async () => {
      const { data, error } = await supabase.from("ministries").select("id, name");
      if (error) {
        toast.error("Error fetching ministries.");
        console.error(error);
      } else {
        setMinistries(data);
      }
    };

    fetchMinistries();
  }, []);

  // Add Department
  const handleAddDepartment = async () => {
    if (!departmentName || !selectedMinistry) {
      toast.error("Department name and ministry are required.");
      return;
    }

    const { data, error } = await supabase.from("departments").insert({
      name: departmentName,
      ministry_id: selectedMinistry,
      manager_id: managerId || null, // Optional manager_id
    });

    // Log the response for debugging purposes
    console.log('Supabase response:', { data, error });

    if (error) {
      toast.error("Error adding department.");
      console.error(error);
    } else {
      toast.success("Department added successfully!");
      // Reset the form fields after success
      setDepartmentName("");
      setSelectedMinistry("");
      setManagerId("");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <Backfunction /> {/* Back Button component */}
      
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Department</h2>

      <div className="mb-6">
        <label className="block font-medium mb-2">Department Name</label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter department name"
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">Select Ministry</label>
        <select
          value={selectedMinistry}
          onChange={(e) => setSelectedMinistry(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Ministry --</option>
          {ministries.map((ministry) => (
            <option key={ministry.id} value={ministry.id}>
              {ministry.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">Manager ID (Optional)</label>
        <input
          type="text"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter manager ID (optional)"
        />
      </div>

      <button
        onClick={handleAddDepartment}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Add Department
      </button>
    </div>
  );
};

export default AddDepartment;

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AddDepartment = () => {
  const [ministries, setMinistries] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [managerId, setManagerId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Ministries
  useEffect(() => {
    const fetchMinistries = async () => {
      const { data, error } = await supabase.from("ministries").select("id, name");
      if (error) {
        setError("Error fetching ministries.");
        console.error(error);
      } else {
        setMinistries(data);
      }
    };

    fetchMinistries();
  }, []);

  // Add Department
  const handleAddDepartment = async () => {
    setError("");
    setSuccess("");

    if (!departmentName || !selectedMinistry) {
      setError("Department name and ministry are required.");
      return;
    }

    const { error } = await supabase.from("departments").insert({
      name: departmentName,
      ministry_id: selectedMinistry,
      manager_id: managerId || null, // Optional manager_id
    });

    if (error) {
      setError("Error adding department.");
      console.error(error);
    } else {
      setSuccess("Department added successfully!");
      setDepartmentName("");
      setSelectedMinistry("");
      setManagerId("");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Add New Department</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <div className="mb-4">
        <label className="block font-medium mb-2">Department Name</label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter department name"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Select Ministry</label>
        <select
          value={selectedMinistry}
          onChange={(e) => setSelectedMinistry(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Ministry --</option>
          {ministries.map((ministry) => (
            <option key={ministry.id} value={ministry.id}>
              {ministry.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Manager ID (Optional)</label>
        <input
          type="text"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter manager ID (optional)"
        />
      </div>

      <button
        onClick={handleAddDepartment}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Add Department
      </button>
    </div>
  );
};

export default AddDepartment;

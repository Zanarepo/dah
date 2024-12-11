import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Backfunction from "../MinistryDashboard/Backfunction"

const AdminAssignment = () => {
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from("access_level")
      .select(
        "id, employee_id, access_id, department_id, ministry_id, employee_profiles(first_name, last_name)"
      );

    if (error) {
      console.error("Error fetching admins:", error.message);
    } else {
      setAdmins(data);
    }
  };

  const fetchDepartments = async () => {
    const { data, error } = await supabase.from("departments").select("id, name");
    if (error) {
      console.error("Error fetching departments:", error.message);
    } else {
      setDepartments(data);
    }
  };

  const fetchMinistries = async () => {
    const { data, error } = await supabase.from("ministries").select("id, name");
    if (error) {
      console.error("Error fetching ministries:", error.message);
    } else {
      setMinistries(data);
    }
  };

  const handleAssign = async () => {
    if (!selectedAdmin) {
      setFeedback({ message: "Please select an admin.", type: "error" });
      return;
    }

    const payload = {};
    if (selectedAdmin.access_id === 1 && selectedDepartment) {
      payload.department_id = selectedDepartment;
    } else if (selectedAdmin.access_id === 2 && selectedMinistry) {
      payload.ministry_id = selectedMinistry;
    } else if (selectedAdmin.access_id === 3) {
      if (selectedDepartment) payload.department_id = selectedDepartment;
      if (selectedMinistry) payload.ministry_id = selectedMinistry;
    } else {
      setFeedback({ message: "Please provide the required assignments.", type: "error" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("access_level")
        .update(payload)
        .eq("id", selectedAdmin.id);

      if (error) throw error;

      setFeedback({ message: "Admin successfully assigned!", type: "success" });

      setSelectedAdmin(null);
      setSelectedDepartment(null);
      setSelectedMinistry(null);

      fetchAdmins();
    } catch (err) {
      console.error("Error updating admin:", err.message);
      setFeedback({ message: "Failed to assign admin: " + err.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchDepartments();
    fetchMinistries();
  }, []);

  <Backfunction/>

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Assignment</h2>

      {feedback.message && (
        <div
          className={`p-3 rounded-md mb-4 ${
            feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Admin:</label>
        <select
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          value={selectedAdmin?.id || ""}
          onChange={(e) =>
            setSelectedAdmin(admins.find((admin) => admin.id === Number(e.target.value)))
          }
        >
          <option value="">-- Select an Admin --</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {`${admin.employee_profiles.first_name} ${admin.employee_profiles.last_name} - Role ID: ${admin.access_id}`}
            </option>
          ))}
        </select>
      </div>

      {selectedAdmin?.access_id === 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Assign Department:</label>
          <select
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            value={selectedDepartment || ""}
            onChange={(e) => setSelectedDepartment(Number(e.target.value))}
          >
            <option value="">-- Select a Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedAdmin?.access_id === 2 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Assign Ministry:</label>
          <select
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            value={selectedMinistry || ""}
            onChange={(e) => setSelectedMinistry(Number(e.target.value))}
          >
            <option value="">-- Select a Ministry --</option>
            {ministries.map((min) => (
              <option key={min.id} value={min.id}>
                {min.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedAdmin?.access_id === 3 && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assign Department:</label>
            <select
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={selectedDepartment || ""}
              onChange={(e) => setSelectedDepartment(Number(e.target.value))}
            >
              <option value="">-- Select a Department --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assign Ministry:</label>
            <select
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={selectedMinistry || ""}
              onChange={(e) => setSelectedMinistry(Number(e.target.value))}
            >
              <option value="">-- Select a Ministry --</option>
              {ministries.map((min) => (
                <option key={min.id} value={min.id}>
                  {min.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button
        onClick={handleAssign}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Assign Admin
      </button>
    </div>
  );
};

export default AdminAssignment;

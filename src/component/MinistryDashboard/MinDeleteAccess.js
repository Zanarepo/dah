import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const DeleteAdmin = () => {
  const [role, setRole] = useState(""); // Selected role
  const [admins, setAdmins] = useState([]); // List of admins for the selected role
  const [selectedAdminId, setSelectedAdminId] = useState(""); // ID of the admin selected for deletion
  const [message, setMessage] = useState(""); // Feedback message
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch admins for the selected role
  const fetchAdmins = async () => {
    if (!role) {
      setAdmins([]);
      return;
    }

    setLoading(true);
    setMessage(""); // Clear any existing message

    try {
      // Get all admins with the selected role
      const { data, error } = await supabase
        .from("access_level")
        .select("employee_id, role_name")
        .eq("role_name", role);

      if (error) throw error;

      // Fetch admin details
      const adminDetails = await Promise.all(
        data.map(async (admin) => {
          const { data: employee, error: empError } = await supabase
            .from("employee_profiles")
            .select("employee_id, first_name, last_name")
            .eq("employee_id", admin.employee_id)
            .single();

          if (empError) throw empError;

          return {
            employee_id: admin.employee_id,
            name: `${employee.first_name} ${employee.last_name}`,
          };
        })
      );

      setAdmins(adminDetails);
    } catch (error) {
      setMessage("Error fetching admins. Please try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete the selected admin
  const handleDelete = async () => {
    if (!selectedAdminId) {
      setMessage("Please select an admin to delete.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Delete admin from `access_level`
      const { error: deleteAccessError } = await supabase
        .from("access_level")
        .delete()
        .eq("employee_id", selectedAdminId)
        .eq("role_name", role);

      if (deleteAccessError) throw deleteAccessError;

      // Reset admin fields in `employee_profiles`
      const { error: resetFieldsError } = await supabase
        .from("employee_profiles")
        .update({
          is_admin: false,
          admin_ministry: false,
          is_super_admin: false,
        })
        .eq("employee_id", selectedAdminId);

      if (resetFieldsError) throw resetFieldsError;

      // Update local state
      setAdmins(admins.filter((admin) => admin.employee_id !== selectedAdminId));
      setSelectedAdminId("");
      setMessage("Admin deleted successfully.");
    } catch (error) {
      setMessage("Error deleting admin. Please try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admins whenever the role changes
  useEffect(() => {
    fetchAdmins();
  }, [role]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Delete Admin</h2>

      {/* Role Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="block w-full px-3 py-2 border rounded"
        >
          <option value="">-- Choose a Role --</option>
          <option value="is_admin">Admin</option>
          <option value="admin_ministry">Ministry Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      {/* Admin List */}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Admin to Delete:</label>
          <select
            value={selectedAdminId}
            onChange={(e) => setSelectedAdminId(e.target.value)}
            className="block w-full px-3 py-2 border rounded"
          >
            <option value="">-- Choose an Admin --</option>
            {admins.map((admin) => (
              <option key={admin.employee_id} value={admin.employee_id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        disabled={loading || !selectedAdminId}
      >
        {loading ? "Deleting..." : "Delete Admin"}
      </button>

      {/* Message */}
      {message && (
        <div className="mt-4 text-center bg-gray-100 text-gray-800 p-2 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default DeleteAdmin;

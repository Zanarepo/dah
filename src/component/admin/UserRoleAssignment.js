import React, { useEffect, useState } from "react";

function UserRoleAssignment() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ user_id: "", role_id: "" });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchAssignments();
  }, []);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      const response = await fetch("https://your-supabase-url/api/users"); // Adjust the Supabase URL accordingly
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch roles from Supabase
  const fetchRoles = async () => {
    try {
      const response = await fetch("https://your-supabase-url/api/roles"); // Adjust the Supabase URL accordingly
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch current user-role assignments
  const fetchAssignments = async () => {
    try {
      const response = await fetch("https://your-supabase-url/api/user-roles"); // Adjust the Supabase URL accordingly
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  // Handle assigning a role to a user
  const handleAssignRole = async () => {
    try {
      if (!newAssignment.user_id || !newAssignment.role_id) {
        alert("Please select both a user and a role.");
        return;
      }

      // Make API call to assign role to user
      await fetch("https://your-supabase-url/api/user-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });

      // Refresh the assignments and reset the form
      fetchAssignments();
      setNewAssignment({ user_id: "", role_id: "" });
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">User Role Assignment</h3>

      {/* Roles and User Role Assignment Table */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td className="border p-2">{assignment.user_name}</td>
              <td className="border p-2">{assignment.role_name}</td>
              <td className="border p-2">
                {/* Placeholder for Edit or Remove buttons */}
                {/* You can add functionality for editing or removing assignments here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Assign Role Form */}
      <div className="mt-4">
        <h4 className="text-lg font-bold">Assign Role</h4>

        {/* User Selection */}
        <select
          value={newAssignment.user_id}
          onChange={(e) =>
            setNewAssignment((prev) => ({ ...prev, user_id: e.target.value }))
          }
          className="border p-2 mr-2"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} {/* Adjust based on the actual field for user name */}
            </option>
          ))}
        </select>

        {/* Role Selection */}
        <select
          value={newAssignment.role_id}
          onChange={(e) =>
            setNewAssignment((prev) => ({ ...prev, role_id: e.target.value }))
          }
          className="border p-2 mr-2"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.role_name} {/* Adjust based on the actual field for role name */}
            </option>
          ))}
        </select>

        {/* Button to Assign Role */}
        <button
          onClick={handleAssignRole}
          className="bg-green-500 text-white px-4 py-2"
        >
          Assign Role
        </button>
      </div>
    </div>
  );
}

export default UserRoleAssignment;

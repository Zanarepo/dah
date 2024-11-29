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

  const fetchUsers = async () => {
    const response = await fetch("/api/users"); // Replace with your Supabase endpoint
    const data = await response.json();
    setUsers(data);
  };

  const fetchRoles = async () => {
    const response = await fetch("/api/roles");
    const data = await response.json();
    setRoles(data);
  };

  const fetchAssignments = async () => {
    const response = await fetch("/api/user-roles");
    const data = await response.json();
    setAssignments(data);
  };

  const handleAssignRole = async () => {
    try {
      await fetch("/api/user-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });
      fetchAssignments();
      setNewAssignment({ user_id: "", role_id: "" });
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">User Role Assignment</h3>
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
                {/* Add Edit and Remove buttons */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Assign Role Form */}
      <div className="mt-4">
        <h4 className="text-lg font-bold">Assign Role</h4>
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
              {user.name}
            </option>
          ))}
        </select>
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
              {role.role_name}
            </option>
          ))}
        </select>
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

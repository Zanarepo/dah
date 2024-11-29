import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

function Settings() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch admin roles and users from Supabase
    const fetchRoles = async () => {
      const { data, error } = await supabase.from("admin_roles").select("*");
      if (error) {
        console.error("Error fetching roles:", error);
      } else {
        setRoles(data);
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase.from("employees").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchRoles();
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, role } = formData;

    if (!role) {
      alert("Please select a role for the user.");
      return;
    }

    try {
      // Create user in employees table
      const { data: userData, error: userError } = await supabase
        .from("employees")
        .insert([{ name, email }])
        .select();

      if (userError) throw userError;

      const userId = userData[0].id;

      // Assign admin role
      const { error: roleError } = await supabase
        .from("admin_user_roles")
        .insert([{ user_id: userId, role_id: role }]);

      if (roleError) throw roleError;

      alert("Admin user created successfully!");
      setFormData({ name: "", email: "", role: "" });
      setIsModalOpen(false);

      // Refresh users list
      const { data: updatedUsers } = await supabase.from("employees").select("*");
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error creating user or assigning role:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      {/* Create User Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        + Create User
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Create Admin User</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block font-medium">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  {
                    roles.find((role) =>
                      role.id ===
                      (user.role_id ? user.role_id : null)
                    )?.role_name || "N/A"
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Settings;

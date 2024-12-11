import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const RoleAssignment = () => {
  const [roles, setRoles] = useState(["is_admin", "admin_ministry", "super_admin"]);
  const [selectedRole, setSelectedRole] = useState("");
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [adminToReplace, setAdminToReplace] = useState(null);
  const [selectedManagerName, setSelectedManagerName] = useState("");

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const { data: departmentData } = await supabase.from("departments").select("*");

        // Fetch ministries
        const { data: ministryData } = await supabase.from("ministries").select("*");

        // Fetch managers and their profiles
        const { data: managerData, error: managerError } = await supabase
          .from("managers")
          .select("*, employee_profiles!managers_employee_id_fkey(*)");

        if (managerError) {
          console.error("Error fetching managers:", managerError.message);
        }

        setDepartments(departmentData || []);
        setMinistries(ministryData || []);
        setManagers(managerData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const checkExistingAdmin = async () => {
    const query = supabase
      .from("access_level")
      .select("employee_id")
      .eq("role_name", selectedRole);

    if (selectedRole === "is_admin") query.eq("department_id", selectedDepartment);
    if (selectedRole === "admin_ministry") query.eq("ministry_id", selectedMinistry);

    const { data: existingAdmin } = await query;

    if (existingAdmin && existingAdmin.length > 0) {
      const adminId = existingAdmin[0].employee_id;
      const admin = managers.find((m) => m.employee_profiles.employee_id === adminId);
      return admin
        ? `${admin.employee_profiles.first_name} ${admin.employee_profiles.last_name}`
        : "Unknown Admin";
    }

    return null;
  };

  const handleRoleAssignment = async () => {
    if (!selectedRole || !selectedManager) {
      setMessage("Please select a role and a manager.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const existingAdminName = await checkExistingAdmin();
    if (existingAdminName) {
      setAdminToReplace(existingAdminName);
      const selectedManagerData = managers.find(
        (manager) => manager.employee_profiles.employee_id === selectedManager
      );
      if (selectedManagerData) {
        setSelectedManagerName(
          `${selectedManagerData.employee_profiles.first_name} ${selectedManagerData.employee_profiles.last_name}`
        );
      }
      setShowModal(true);
      return;
    }

    assignRole();
  };

  const assignRole = async () => {
    try {
      const accessId = selectedRole === "is_admin" ? 1 : selectedRole === "admin_ministry" ? 2 : 3;

      if (adminToReplace) {
        const admin = managers.find(
          (m) => `${m.employee_profiles.first_name} ${m.employee_profiles.last_name}` === adminToReplace
        );

        if (admin) {
          const adminId = admin.employee_profiles.employee_id;

          await supabase
            .from("access_level")
            .update({
              employee_id: selectedManager,
              role_name: selectedRole,
              department_id: selectedDepartment || null,
              ministry_id: selectedMinistry || null,
              access_id: accessId,
            })
            .eq("employee_id", adminId);

          await supabase
            .from("employee_profiles")
            .update({
              is_admin: false,
              admin_ministry: false,
              is_super_admin: false,
            })
            .eq("employee_id", adminId);
        }
      }

      await supabase.from("access_level").upsert({
        employee_id: selectedManager,
        department_id: selectedDepartment || null,
        ministry_id: selectedMinistry || null,
        access_id: accessId,
        role_name: selectedRole,
      });

      const updates = {
        is_admin: selectedRole === "is_admin" || selectedRole === "admin_ministry" || selectedRole === "super_admin",
        admin_ministry: selectedRole === "admin_ministry" || selectedRole === "super_admin",
        is_super_admin: selectedRole === "super_admin",
      };

      await supabase
        .from("employee_profiles")
        .update({
          ...updates,
          department_id: selectedDepartment || null,
          ministry_id: selectedMinistry || null,
        })
        .eq("employee_id", selectedManager);

      setMessage("Role assigned successfully!");
      setTimeout(() => setMessage(""), 3000);
      setShowModal(false);
    } catch (error) {
      console.error("Error assigning role:", error.message);
      setMessage("Error assigning role. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Role Assignment</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Role:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="block w-full px-3 py-2 border rounded"
        >
          <option value="">-- Choose a Role --</option>
          {roles.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Manager:</label>
        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
          className="block w-full px-3 py-2 border rounded"
        >
          <option value="">-- Choose a Manager --</option>
          {managers.map((manager) => (
            <option
              key={manager.employee_profiles.employee_id}
              value={manager.employee_profiles.employee_id}
            >
              {manager.employee_profiles.first_name} {manager.employee_profiles.last_name}
            </option>
          ))}
        </select>
      </div>

      {selectedRole === "is_admin" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="block w-full px-3 py-2 border rounded"
          >
            <option value="">-- Choose a Department --</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedRole === "admin_ministry" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Ministry:</label>
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="block w-full px-3 py-2 border rounded"
          >
            <option value="">-- Choose a Ministry --</option>
            {ministries.map((ministry) => (
              <option key={ministry.id} value={ministry.id}>
                {ministry.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleRoleAssignment}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Assign Role
      </button>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Role Replacement</h3>
            <p>
              {adminToReplace} is already assigned the {selectedRole} role. Do you want to replace this admin with {selectedManagerName}?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={assignRole}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleAssignment;

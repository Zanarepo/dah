import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const RoleAssignment = () => {
  const [roles, setRoles] = useState(["is_admin", "admin_ministry", "super_admin"]);
  const [selectedRole, setSelectedRole] = useState("");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [adminToReplace, setAdminToReplace] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const { data: employeeData } = await supabase.from("employee_profiles").select("*");
      const { data: departmentData } = await supabase.from("departments").select("*");
      const { data: ministryData } = await supabase.from("ministries").select("*");

      setEmployees(employeeData || []);
      setDepartments(departmentData || []);
      setMinistries(ministryData || []);
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
      const admin = employees.find((e) => e.employee_id === adminId);
      return admin ? `${admin.first_name} ${admin.last_name}` : "Unknown Admin";
    }
  
    return null;
  };
  
  const handleRoleAssignment = async () => {
    if (!selectedRole || !selectedEmployee) {
      setMessage("Please select a role and an employee.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
  
    const existingAdminName = await checkExistingAdmin();
    if (existingAdminName) {
      setAdminToReplace(existingAdminName);
      setShowModal(true);
      return;
    }
  
    assignRole();
  };
  
  const assignRole = async () => {
    try {
      const accessId = selectedRole === "is_admin" ? 1 : selectedRole === "admin_ministry" ? 2 : 3;
  
      // Replace the existing admin if necessary
      if (adminToReplace) {
        const admin = employees.find((e) => `${e.first_name} ${e.last_name}` === adminToReplace);
        if (admin) {
          // Update only the `access_level` for the replaced admin, leaving their employee profile intact
          await supabase
            .from("access_level")
            .update({
              role_name: null, // You can choose to clear role_name in access_level for the replaced admin
              department_id: null, // Do not clear department_id, set to null only if necessary
              ministry_id: null,   // Same for ministry_id
            })
            .eq("employee_id", admin.employee_id);
  
          // Reset only role flags in `employee_profiles` for the replaced admin
          await supabase
            .from("employee_profiles")
            .update({ is_admin: false, admin_ministry: false, is_super_admin: false })
            .eq("employee_id", admin.employee_id);
        }
      }
  
      // Upsert the new admin in `access_level` with their department and ministry info
      await supabase.from("access_level").upsert({
        employee_id: selectedEmployee,
        department_id: selectedDepartment, // Do not set to null
        ministry_id: selectedMinistry,     // Do not set to null
        access_id: accessId,
        role_name: selectedRole,
      });
  
      // Update the new admin's role flags in `employee_profiles`
      const updates = {
        is_admin: selectedRole === "is_admin" || selectedRole === "admin_ministry" || selectedRole === "super_admin",
        admin_ministry: selectedRole === "admin_ministry" || selectedRole === "super_admin",
        is_super_admin: selectedRole === "super_admin",
      };
  
      await supabase.from("employee_profiles").update(updates).eq("employee_id", selectedEmployee);
  
      setMessage("Role assigned successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error assigning role:", error.message);
      setMessage("Error assigning role. Please try again.");
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Role Assignment</h2>

      {/* Role Dropdown */}
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

      {/* Employee Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="block w-full px-3 py-2 border rounded"
        >
          <option value="">-- Choose an Employee --</option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {`${employee.first_name} ${employee.last_name}`}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional Dropdowns */}
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

      {/* Submit Button */}
      <button
        onClick={handleRoleAssignment}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Assign Role
      </button>

      {/* Message */}
      {message && <div className="mt-4 text-center bg-gray-100 text-gray-800 p-2 rounded">{message}</div>}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4">
              Are you sure you want to replace <span className="font-semibold">{adminToReplace}</span>?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={assignRole}
                className="bg-red-500 text-white py-2 px-4 rounded mr-2"
              >
                Yes, Replace
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleAssignment;

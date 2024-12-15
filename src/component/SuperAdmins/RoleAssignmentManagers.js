import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Import supabase client
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const RoleAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRole, setSelectedRole] = useState(""); // Role selection (is_admin, admin_ministry, super_admin)
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employees, ministries, and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Employees
        const { data: employeesData, error: employeeError } = await supabase
          .from("employee_profiles")
          .select("employee_id, first_name, last_name");
        if (employeeError) throw employeeError;
        setEmployees(employeesData);

        // Fetch Ministries
        const { data: ministriesData, error: ministriesError } = await supabase
          .from("ministries")
          .select("id, name");
        if (ministriesError) throw ministriesError;
        setMinistries(ministriesData);

        // Fetch Departments
        const { data: departmentsData, error: departmentsError } = await supabase
          .from("departments")
          .select("id, name");
        if (departmentsError) throw departmentsError;
        setDepartments(departmentsData);
        
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  // Helper function to map role name to access_id
  const getAccessIdFromRole = (roleName) => {
    switch (roleName) {
      case "is_admin":
        return 1; // access_id 1 for is_admin
      case "admin_ministry":
        return 2; // access_id 2 for admin_ministry
      case "super_admin":
        return 3; // access_id 3 for super_admin
      default:
        return null; // Default case in case of an invalid role
    }
  };

  // Function to update employee profile based on role
  const updateEmployeeProfile = async (employeeId, roleName) => {
    let updateData = {};

    // Set the employee profile fields based on the selected role
    if (roleName === "is_admin") {
      updateData = { is_admin: true, admin_ministry: false, is_super_admin: false };
    } else if (roleName === "admin_ministry") {
      updateData = { is_admin: false, admin_ministry: true, is_super_admin: false };
    } else if (roleName === "super_admin") {
      updateData = { is_admin: true, admin_ministry: true, is_super_admin: true };
    } else {
      updateData = { is_admin: false, admin_ministry: false, is_super_admin: false };
    }

    // Update employee profile
    const { data, error } = await supabase
      .from("employee_profiles")
      .update(updateData)
      .eq("employee_id", employeeId);

    if (error) {
      console.error("Error updating employee profile:", error.message);
      toast.error("Error updating employee profile."); // Show error toast
    } else {
      console.log("Employee profile updated successfully:", data);
      toast.success("Employee profile updated successfully!"); // Show success toast
    }
  };

  // Function to assign a role to an employee
  const assignRoleToEmployee = async (employeeId, roleName, ministryId, departmentId) => {
    const accessId = getAccessIdFromRole(roleName);
    if (accessId === null) {
      toast.error("Invalid role selected."); // Show error toast
      return;
    }

    try {
      // Ensure employee_id exists in employee_profiles
      const { data: employeeData, error: employeeError } = await supabase
        .from("employee_profiles")
        .select("employee_id")
        .eq("employee_id", employeeId)
        .single();

      if (employeeError || !employeeData) {
        toast.error("Selected employee not found."); // Show error toast
        return;
      }

      // Ensure ministry_id exists in ministries table
      const { data: ministryData, error: ministryError } = await supabase
        .from("ministries")
        .select("id")
        .eq("id", ministryId)
        .single();

      if (ministryError || !ministryData) {
        toast.error("Selected ministry not found."); // Show error toast
        return;
      }

      // Ensure department_id exists in departments table
      const { data: departmentData, error: departmentError } = await supabase
        .from("departments")
        .select("id")
        .eq("id", departmentId)
        .single();

      if (departmentError || !departmentData) {
        toast.error("Selected department not found."); // Show error toast
        return;
      }

      // Perform upsert to assign the role using role_name
      const { data, error } = await supabase
        .from("access_level")
        .upsert([
          {
            employee_id: employeeId, // Correctly reference employee_id
            role_name: roleName,
            access_id: accessId, // Set the access_id based on the role
            ministry_id: ministryId,
            department_id: departmentId,
          },
        ], { onConflict: ["employee_id"] }); // Handle conflicts using employee_id

      if (error) throw error;

      console.log("Role assigned successfully:", data);
      toast.success("Role assigned successfully!"); // Show success toast

      // After assigning the role, update the employee profile
      updateEmployeeProfile(employeeId, roleName);

    } catch (error) {
      console.error("Error assigning role:", error.message);
      toast.error("Error assigning role."); // Show error toast
    }
  };

  const handleRoleAssignment = () => {
    if (!selectedEmployee || !selectedRole || !selectedMinistry || !selectedDepartment) {
      toast.error("Please select all fields."); // Show error toast
      return;
    }

    setLoading(true);

    // Assign role based on selectedRole
    assignRoleToEmployee(
      selectedEmployee.employee_id, // Use employee_id instead of id
      selectedRole, 
      selectedMinistry, 
      selectedDepartment
    );

    setLoading(false);
  };

  return (
    <div className="role-assignment p-6">
      <h2 className="text-xl font-bold mb-4">Role Assignment</h2>

      {/* Employee Selection */}
      <div className="mb-4">
        <label htmlFor="employee" className="block text-sm font-semibold">Select Employee</label>
        <select
          id="employee"
          value={selectedEmployee ? selectedEmployee.employee_id : ""}
          onChange={(e) => {
            const employee = employees.find(emp => emp.employee_id === parseInt(e.target.value));
            setSelectedEmployee(employee);
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Role Selection */}
      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-semibold">Select Role</label>
        <select
          id="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Role</option>
          <option value="is_admin">is_admin</option>
          <option value="admin_ministry">admin_ministry</option>
          <option value="super_admin">super_admin</option>
        </select>
      </div>

      {/* Ministry Selection */}
      <div className="mb-4">
        <label htmlFor="ministry" className="block text-sm font-semibold">Select Ministry</label>
        <select
          id="ministry"
          value={selectedMinistry}
          onChange={(e) => setSelectedMinistry(parseInt(e.target.value))}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Ministry</option>
          {ministries.map((ministry) => (
            <option key={ministry.id} value={ministry.id}>
              {ministry.name}
            </option>
          ))}
        </select>
      </div>

      {/* Department Selection */}
      <div className="mb-4">
        <label htmlFor="department" className="block text-sm font-semibold">Select Department</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assign Role Button */}
      <button
        onClick={handleRoleAssignment}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        {loading ? "Assigning..." : "Assign Role"}
      </button>
    </div>
  );
};

export default RoleAssignment;

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ManageChannelMembers = ({ channelId }) => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelMembers, setChannelMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("employee_id, first_name, last_name, department_id");
      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        setEmployees(data); // Ensure employees are stored with employee_id
      }
    };

    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("id, name");
      if (error) {
        console.error("Error fetching departments:", error);
      } else {
        setDepartments(data);
      }
    };

    const fetchChannelMembers = async () => {
      const { data, error } = await supabase
        .from("channel_members")
        .select("employee_id")
        .eq("channel_id", channelId);
      if (error) {
        console.error("Error fetching channel members:", error);
      } else {
        setChannelMembers(data.map((member) => member.employee_id)); // Use employee_id here
      }
    };

    fetchEmployees();
    fetchDepartments();
    fetchChannelMembers();
  }, [channelId]);

  const handleAddMember = async (employeeId) => {
    try {
      const { error } = await supabase.from("channel_members").insert({
        channel_id: channelId,
        employee_id: employeeId,
      });
      if (error) {
        console.error("Error adding member:", error);
      } else {
        setChannelMembers((prev) => [...prev, employeeId]);
      }
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  const handleRemoveMember = async (employeeId) => {
    try {
      const { error } = await supabase
        .from("channel_members")
        .delete()
        .eq("channel_id", channelId)
        .eq("employee_id", employeeId);
      if (error) {
        console.error("Error removing member:", error);
      } else {
        setChannelMembers((prev) => prev.filter((id) => id !== employeeId));
      }
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  const handleAddDepartment = async () => {
    if (!selectedDepartment) return;

    const departmentEmployees = employees.filter(
      (emp) => emp.department_id === selectedDepartment
    );

    try {
      const newMembers = departmentEmployees
        .filter((emp) => !channelMembers.includes(emp.employee_id))
        .map((emp) => ({
          channel_id: channelId,
          employee_id: emp.employee_id,
        }));

      const { error } = await supabase.from("channel_members").insert(newMembers);
      if (error) {
        console.error("Error adding department members:", error);
      } else {
        setChannelMembers((prev) => [
          ...prev,
          ...newMembers.map((member) => member.employee_id),
        ]);
      }
    } catch (err) {
      console.error("Error adding department members:", err);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Channel Members</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="mb-4">
        <select
          value={selectedDepartment || ""}
          onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg bg-black text-white dark:bg-black dark:text-white"
        >
          <option value="" disabled>
            Select a department
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddDepartment}
          className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Entire Department
        </button>
      </div>

      <ul className="mb-4">
        {filteredEmployees.map((employee) => (
          <li
            key={employee.employee_id}
            className="flex justify-between items-center border-b py-2 text-white"
          >
            <span>
              {employee.first_name} {employee.last_name}
            </span>
            {channelMembers.includes(employee.employee_id) ? (
              <button
                onClick={() => handleRemoveMember(employee.employee_id)}
                className="bg-red-500 text-white px-4 py-1 rounded-lg"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => handleAddMember(employee.employee_id)}
                className="bg-green-500 text-white px-4 py-1 rounded-lg"
              >
                Add
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageChannelMembers;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Assuming supabaseClient.js is set up
import { toast } from 'react-toastify';

const ManageEmployees = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch departments from the database
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase.from('departments').select('*');
        if (error) throw error;
        setDepartments(data);
      } catch (error) {
        toast.error('Error fetching departments');
      }
    };

    fetchDepartments();
  }, []);

  // Fetch channels when the component mounts
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data, error } = await supabase.from('department_chat_channels').select('*');
        if (error) throw error;
        setChannels(data);
      } catch (error) {
        toast.error('Error fetching channels');
      }
    };

    fetchChannels();
  }, []);

  // Fetch employees when a department is selected
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedDepartment) return;

      try {
        const { data, error } = await supabase
          .from('employee_profiles')
          .select('employee_id, first_name, last_name')
          .eq('department_id', selectedDepartment);

        if (error) throw error;
        setEmployees(data);
        setSelectedEmployees([]); // Reset selected employees
        setSelectAll(false); // Reset "select all" checkbox
      } catch (error) {
        toast.error('Error fetching employees');
      }
    };

    fetchEmployees();
  }, [selectedDepartment]);

  // Handle individual employee selection
  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((employee) => employee.employee_id));
    }
    setSelectAll(!selectAll);
  };

  const handleAddEmployees = async () => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee to add.');
      return;
    }

    const adminEmployeeId = localStorage.getItem('employee_id'); // Assuming admin's employee ID is stored in localStorage

    if (!adminEmployeeId) {
      toast.error('Admin is not logged in.');
      return;
    }

    // Ensure that a channel is selected
    if (!selectedChannel) {
      toast.error('Please select a channel.');
      return;
    }

    try {
      const insertPromises = selectedEmployees.map(async (employeeId) => {
        const { error } = await supabase
          .from('channel_members')
          .insert([
            {
              channel_id: selectedChannel, // Use selected channel_id
              employee_id: employeeId, // Employee ID
              added_by: adminEmployeeId, // Admin's employee ID
              added_at: new Date(),
            },
          ]);

        if (error) throw error;
      });

      await Promise.all(insertPromises);
      toast.success('Employees successfully added to the channel!');
    } catch (error) {
      toast.error('Error adding employees to the channel.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Employees</h1>

      {/* Department Dropdown */}
      <div className="mb-4">
        <label htmlFor="department-select" className="block mb-2">Select Department:</label>
        <select
          id="department-select"
          className="w-full p-2 border"
          onChange={(e) => setSelectedDepartment(e.target.value)}
          value={selectedDepartment || ''}
        >
          <option value="">Select a Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Channel Dropdown */}
      <div className="mb-4">
        <label htmlFor="channel-select" className="block mb-2">Select Channel:</label>
        <select
          id="channel-select"
          className="w-full p-2 border"
          onChange={(e) => setSelectedChannel(e.target.value)}
          value={selectedChannel || ''}
        >
          <option value="">Select a Channel</option>
          {channels.map((channel) => (
            <option key={channel.channel_id} value={channel.channel_id}>
              {channel.channel_name}
            </option>
          ))}
        </select>
      </div>

      {/* Employees List */}
      {selectedDepartment && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Employees in this Department</h2>

          {/* Select All Checkbox */}
          <div className="mb-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <label>Select All</label>
          </div>

          {/* Employee List */}
          {employees.map((employee) => (
            <div key={employee.employee_id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`employee-${employee.employee_id}`}
                checked={selectedEmployees.includes(employee.employee_id)}
                onChange={() => handleEmployeeSelection(employee.employee_id)}
                className="mr-2"
              />
              <label htmlFor={`employee-${employee.employee_id}`} className="text-lg">
                {employee.first_name} {employee.last_name}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Add Employees Button */}
      {selectedEmployees.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleAddEmployees}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Selected Employees to Channel
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;

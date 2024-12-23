import React, { useState, useEffect } from 'react';  // Make sure React is imported
import { supabase } from '../../supabaseClient';  // Adjust to your file path
import { toast } from 'react-toastify';

const AdminTaskAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch admin info and employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const employeeId = localStorage.getItem('employee_id'); // Get logged-in employee_id from localStorage

      // Fetch access level for the logged-in employee
      const { data: accessData, error: accessError } = await supabase
        .from('access_level')
        .select('access_id, ministry_id, department_id')
        .eq('employee_id', employeeId)
        .single();

      if (accessError || !accessData) {
        console.error('Error fetching access level:', accessError);
        return;
      }

      let employeeQuery = supabase.from('employee_profiles').select('*');

      // Adjust employee query based on access level
      if (accessData.access_id === 1) {
        // is_admin: Access to specific department
        employeeQuery = employeeQuery.eq('department_id', accessData.department_id);
      } else if (accessData.access_id === 2) {
        // admin_ministry: Access to all departments in specific ministry
        employeeQuery = employeeQuery.eq('ministry_id', accessData.ministry_id);
      } else if (accessData.access_id === 3) {
        // super_admin: Access to all departments and ministries
        // No filter applied for super_admin
      }

      const { data: employeesData, error: employeeError } = await employeeQuery;

      if (employeeError) {
        console.error('Error fetching employees:', employeeError);
        return;
      }

      setEmployees(employeesData);
    };

    fetchEmployees();
  }, []); // Run once on component mount

  const assignTask = async () => {
    if (!selectedEmployee || !taskName || !dueTime) {
      toast.error('Please fill all fields.');
      return;
    }

    setLoading(true);

    const employeeId = localStorage.getItem('employee_id'); // Get logged-in employee_id

    const { data: accessData, error: accessError } = await supabase
      .from('access_level')
      .select('department_id, ministry_id')
      .eq('employee_id', employeeId)
      .single();

    if (accessError) {
      toast.error('Error fetching access level.');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('task_manager')
      .insert([
        {
          task_name: taskName,
          employee_id: selectedEmployee.employee_id,
          due_time: dueTime,
          status: 'Pending',
          department_id: accessData.department_id,
          ministry_id: accessData.ministry_id,
        },
      ]);

    if (error) {
      toast.error('Error assigning task.');
      setLoading(false);
      return;
    }

    toast.success('Task assigned successfully!');
    setLoading(false);
    setTaskName('');
    setDueTime('');
    setSelectedEmployee(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Assignment</h1>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600">Select Employee</label>
        <select
          value={selectedEmployee ? selectedEmployee.employee_id : ''}
          onChange={(e) => {
            const selected = employees.find((emp) => emp.employee_id === parseInt(e.target.value));
            setSelectedEmployee(selected);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp.employee_id} value={emp.employee_id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600">Task Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600">Due Date</label>
        <input
          type="datetime-local"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>

      <button
        onClick={assignTask}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {loading ? 'Assigning Task...' : 'Assign Task'}
      </button>
    </div>
  );
};

export default AdminTaskAssignment;

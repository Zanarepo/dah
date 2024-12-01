import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AssignAdminRoles = () => {
  const [ministries, setMinistries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedRole, setSelectedRole] = useState('Admin'); // Default role is Admin
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch ministries (on component mount)
  useEffect(() => {
    const fetchMinistries = async () => {
      const { data, error } = await supabase.from('ministries').select('id, name');
      if (error) {
        console.error('Error fetching ministries:', error.message);
      } else {
        setMinistries(data);
      }
    };
    fetchMinistries();
  }, []);

  // Fetch employees when ministry is selected
  useEffect(() => {
    if (selectedMinistry) {
      const fetchEmployees = async () => {
        const { data, error } = await supabase
          .from('employee_profiles')
          .select('employee_id, first_name, last_name')
          .eq('ministry_id', selectedMinistry); // Fetch employees based on selected ministry

        if (error) {
          console.error('Error fetching employees:', error.message);
        } else {
          setEmployees(data);
        }
      };
      fetchEmployees();
    } else {
      setEmployees([]); // Clear employees if no ministry is selected
    }
  }, [selectedMinistry]);

  // Handle form submission to assign admin role
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
  
    try {
      // Insert the selected employee as admin for the selected ministry
      const { data, error } = await supabase
        .from('admin_ministry')
        .insert([
          {
            admin_id: selectedEmployee, // The employee selected is now an admin
            ministry_id: selectedMinistry,
            role: selectedRole, // Role is either Admin or Manager
          }
        ]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Update the employee's profile to set is_admin to true
      const { updateData, updateError } = await supabase
        .from('employee_profiles')
        .update({ is_admin: true }) // Set is_admin to true
        .eq('employee_id', selectedEmployee); // Update the employee's profile based on employee_id
  
      if (updateError) {
        throw new Error(updateError.message);
      }
  
      setSuccessMessage('Admin role assigned successfully, and profile updated!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Clear message after 3 seconds
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Clear error message after 3 seconds
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Assign Admin Role to Employee</h2>
      
      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ministry Dropdown */}
        <div>
          <label htmlFor="ministry" className="block text-sm font-medium">Ministry</label>
          <select
            id="ministry"
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Ministry</option>
            {ministries.map((ministry) => (
              <option key={ministry.id} value={ministry.id}>
                {ministry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Employee Dropdown */}
        <div>
          <label htmlFor="employee" className="block text-sm font-medium">Employee</label>
          <select
            id="employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.employee_id} value={employee.employee_id}>
                {employee.first_name} {employee.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Dropdown */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium">Role</label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mt-4"
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Assign Role'}
        </button>
      </form>
    </div>
  );
};

export default AssignAdminRoles;

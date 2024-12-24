import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const EmployeeIssueReport = () => {
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [employeeId, setEmployeeId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const employee = localStorage.getItem('employee_id');
    if (employee) {
      setEmployeeId(employee);
      fetchEmployeeDepartmentAndAdmins(employee);
    } else {
      setErrorMessage('Please log in to report an issue.');
    }
  }, []);

  const fetchEmployeeDepartmentAndAdmins = async (employeeId) => {
    try {
      const departmentResponse = await supabase
        .from('access_level')
        .select('department_id')
        .eq('employee_id', employeeId)
        .single();

      if (!departmentResponse.data) {
        setErrorMessage('No department found for this employee.');
        setLoading(false);
        return;
      }

      const departmentId = departmentResponse.data.department_id;
      setDepartmentId(departmentId);

      const adminsResponse = await supabase
        .from('access_level')
        .select('employee_id')
        .eq('department_id', departmentId);

      if (adminsResponse.data.length === 0) {
        setErrorMessage('No admins found for this department.');
        setLoading(false);
        return;
      }

      const adminIds = adminsResponse.data.map((admin) => admin.employee_id);
      const profilesResponse = await supabase
        .from('employee_profiles')
        .select('employee_id, first_name, last_name')
        .in('employee_id', adminIds);

      if (profilesResponse.data.length === 0) {
        setErrorMessage('No admin profiles found.');
        setLoading(false);
        return;
      }

      setAdmins(profilesResponse.data);
    } catch (error) {
      console.error('Error fetching department and admins:', error);
      setErrorMessage('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issueType || !issueDescription || !selectedAdmin) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      const { error } = await supabase.from('employee_issue_reports').insert([
        {
          employee_id: employeeId,
          issue_type: issueType,
          issue_description: issueDescription,
          admin_id: selectedAdmin,
          department_id: departmentId,
        },
      ]);

      if (error) {
        throw error;
      }

      setSuccessMessage('Your issue has been reported successfully!');
      setIssueType('');
      setIssueDescription('');
      setSelectedAdmin('');
    } catch (error) {
      console.error('Error submitting the issue:', error);
      setErrorMessage('An error occurred while submitting the issue.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Report an Issue</h2>
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">Issue Type</label>
          <select
            id="issueType"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="block w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Issue Type</option>
            <option value="check_in_issue">Check-In Issue</option>
            <option value="vacation_request_issue">Vacation Request Issue</option>
            <option value="work_related_issue">Other Work-Related Issue</option>
          </select>
        </div>
        <div>
          <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="issueDescription"
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            rows="4"
            className="block w-full px-3 py-2 border rounded-md"
          ></textarea>
        </div>
        <div>
          <label htmlFor="selectedAdmin" className="block text-sm font-medium text-gray-700">Admin</label>
          <select
            id="selectedAdmin"
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="block w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Admin</option>
            {admins.map((admin) => (
              <option key={admin.employee_id} value={admin.employee_id}>
                {admin.first_name} {admin.last_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">Submit Report</button>
      </form>
    </div>
  );
};

export default EmployeeIssueReport;

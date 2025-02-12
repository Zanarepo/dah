import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const adminEmployeeId = localStorage.getItem('employee_id');

  // Memoize fetchEmployees function
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const { data: adminData, error: adminError } = await supabase
        .from('department_admins')
        .select('department_id')
        .eq('employee_id', adminEmployeeId)
        .maybeSingle();

      if (adminError) throw new Error(adminError.message);

      if (!adminData) {
        setError('You are not assigned to any department.');
        setEmployees([]);
        setLoading(false);
        return;
      }

      const departmentId = adminData.department_id;

      const { data: employeeData, error: employeeError } = await supabase
        .from('employee_profiles')
        .select(
          `employee_id, first_name, last_name, profile_picture, position, state_of_origin, department_id, departments(name)`
        )
        .eq('department_id', departmentId);

      if (employeeError) throw new Error(employeeError.message);

      setEmployees(employeeData || []);
      setFilteredEmployees(employeeData || []);
    } catch (err) {
      setError(err.message);
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [adminEmployeeId]); // Adding adminEmployeeId as a dependency

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]); // Now fetchEmployees is safely included in the dependency array

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredEmployees(employees);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.first_name.toLowerCase().includes(lowercasedQuery) ||
        employee.last_name.toLowerCase().includes(lowercasedQuery) ||
        employee.position.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredEmployees(filtered);
  };

  const handleChangeSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      {/* Visible Back Button */}
      <button
        className="absolute top-4 left-4 flex items-center text-blue-500 hover:text-blue-700"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="flex mb-4 gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Search by Name or Position"
          className="w-full md:w-96 border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={handleChangeSearch}
        />
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-400 transition-all duration-300"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 py-3 px-4 text-left text-sm text-gray-600">#</th>
              <th className="border border-gray-300 py-3 px-4 text-left text-sm text-gray-600">First Name</th>
              <th className="border border-gray-300 py-3 px-4 text-left text-sm text-gray-600">Last Name</th>
              <th className="border border-gray-300 py-3 px-4 text-left text-sm text-gray-600">Position</th>
              <th className="border border-gray-300 py-3 px-4 text-left text-sm text-gray-600">Department</th>
              <th className="border border-gray-300 py-3 px-4 text-left text-sm text-gray-600">State of Origin</th>
              <th className="border border-gray-300 py-3 px-4 text-left text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <tr key={employee.employee_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 py-2 px-4 text-center">{index + 1}</td>
                  <td className="border border-gray-300 py-2 px-4">{employee.first_name}</td>
                  <td className="border border-gray-300 py-2 px-4">{employee.last_name}</td>
                  <td className="border border-gray-300 py-2 px-4">{employee.position}</td>
                  <td className="border border-gray-300 py-2 px-4">{employee.departments?.name || 'N/A'}</td>
                  <td className="border border-gray-300 py-2 px-4">{employee.state_of_origin}</td>
                  <td className="border border-gray-300 py-2 px-4">
                    <button
                      onClick={() => handleViewEmployee(employee)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-400 transition-all duration-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedEmployee && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 md:w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Employee Details</h2>
            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedEmployee.profile_picture || '/default-profile.png'}
                alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                className="w-32 h-32 rounded-full mb-4"
              />
              <p className="font-bold text-lg">{`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}</p>
              <p className="text-sm text-gray-500">{selectedEmployee.position}</p>
              <p className="mt-2 text-sm text-gray-600">State of Origin: {selectedEmployee.state_of_origin}</p>
            </div>
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;

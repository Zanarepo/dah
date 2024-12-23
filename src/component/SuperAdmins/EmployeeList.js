import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import Papa from 'papaparse';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeId = localStorage.getItem('employee_id');
        if (!employeeId) {
          toast.error('Employee ID not found.');
          return;
        }

        const { data: accessData, error: accessError } = await supabase
          .from('access_level')
          .select('access_id, department_id, ministry_id')
          .eq('employee_id', employeeId)
          .single();

        if (accessError || !accessData) {
          toast.error('Access level not found.');
          return;
        }

        const { access_id: accessId, department_id: departmentId, ministry_id: ministryId } = accessData;

        let employeeQuery = supabase
          .from('employee_profiles')
          .select(`
            id, 
            first_name, 
            last_name, 
            position, 
            qualification, 
            state_of_origin, 
            lga_of_origin, 
            sex, 
            employment_date, 
            grade_level, 
            department_id,
            departments(name)
          `);

        if (accessId === 1) {
          employeeQuery = employeeQuery.eq('department_id', departmentId);
        } else if (accessId === 2) {
          employeeQuery = employeeQuery.eq('ministry_id', ministryId);
        }

        const { data: employeeData, error: employeeError } = await employeeQuery;

        if (employeeError) {
          toast.error('Error fetching employee data.');
          return;
        }

        const { data: departmentData, error: departmentError } = await supabase
          .from('departments')
          .select('*');

        if (departmentError) {
          toast.error('Error fetching department data.');
          return;
        }

        setEmployees(employeeData || []);
        setDepartments(departmentData || []);
        setFilteredEmployees(employeeData || []);
      } catch (error) {
        toast.error('Something went wrong.');
      }
    };

    fetchEmployeeData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = employees.filter((emp) =>
      Object.values(emp).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handleDepartmentFilter = (departmentId) => {
    setSelectedDepartment(departmentId);
    const filtered = departmentId
      ? employees.filter((emp) => emp.department_id === parseInt(departmentId, 10))
      : employees;
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handleDownloadCSV = () => {
    const csvData = filteredEmployees.map((emp) => ({
      Name: `${emp.first_name} ${emp.last_name}`,
      Department: emp.departments?.name || 'N/A',
      Position: emp.position,
      Qualification: emp.qualification,
      'State of Origin': emp.state_of_origin,
      'LGA of Origin': emp.lga_of_origin,
      Sex: emp.sex,
      'Employment Date': emp.employment_date,
      'Grade Level': emp.grade_level,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_list.csv');
    link.click();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center">
          <select
            value={selectedDepartment}
            onChange={(e) => handleDepartmentFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mr-4"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search employees by any field"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleDownloadCSV}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Download CSV
        </button>
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Position</th>
            <th className="px-4 py-2 border">Qualification</th>
            <th className="px-4 py-2 border">State of Origin</th>
            <th className="px-4 py-2 border">LGA of Origin</th>
            <th className="px-4 py-2 border">Sex</th>
            <th className="px-4 py-2 border">Employment Date</th>
            <th className="px-4 py-2 border">Grade Level</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-4 py-2 border">
                {employee.first_name} {employee.last_name}
              </td>
              <td className="px-4 py-2 border">{employee.departments?.name || 'N/A'}</td>
              <td className="px-4 py-2 border">{employee.position}</td>
              <td className="px-4 py-2 border">{employee.qualification}</td>
              <td className="px-4 py-2 border">{employee.state_of_origin}</td>
              <td className="px-4 py-2 border">{employee.lga_of_origin}</td>
              <td className="px-4 py-2 border">{employee.sex}</td>
              <td className="px-4 py-2 border">{employee.employment_date}</td>
              <td className="px-4 py-2 border">{employee.grade_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {[...Array(Math.ceil(filteredEmployees.length / itemsPerPage)).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => paginate(page + 1)}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;

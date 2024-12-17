import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import FileSaver from 'file-saver';
import { useNavigate } from "react-router-dom";

const DepartmentAdmin = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [setNoProfilesFound] = useState(false);
  const navigate = useNavigate();
  
  const adminEmployeeId = localStorage.getItem('employee_id');

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
          `employee_id, first_name, last_name, profile_picture, email, phone_number, 
          nationality, state_of_origin, lga_of_origin, employment_date, employment_type, 
          position, grade_level, qualification, department_id`
        )
        .eq('department_id', departmentId);

      if (employeeError) throw new Error(employeeError.message);

      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminEmployeeId]); // Add `adminEmployeeId` as a dependency to ensure stability.

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Rest of the component...


  const handleSearch = () => {
    setSearchLoading(true);
    setNoProfilesFound(false);

    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
      setSearchLoading(false);
    } else {
      const filtered = employees.filter((employee) =>
        `${employee.first_name} ${employee.last_name} ${employee.position}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      if (filtered.length === 0) {
        setNoProfilesFound(true);
      }

      setFilteredEmployees(filtered);
      setSearchLoading(false);
    }
  };

  const downloadEmployeeList = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "Employee ID",
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Nationality",
          "State of Origin",
          "LGA of Origin",
          "Employment Date",
          "Employment Type",
          "Position",
          "Grade Level",
          "Qualification",
        ].join(","),
        ...filteredEmployees.map((employee) =>
          [
            employee.employee_id,
            employee.first_name,
            employee.last_name,
            employee.email || "N/A",
            employee.phone || "N/A",
            employee.nationality || "N/A",
            employee.state_of_origin || "N/A",
            employee.lga_of_origin || "N/A",
            employee.employment_date || "N/A",
            employee.employment_type || "N/A",
            employee.position || "N/A",
            employee.grade_level || "N/A",
            employee.qualification || "N/A",
          ].join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const fileName = `employees_department_${adminEmployeeId}.csv`;
    FileSaver.saveAs(encodedUri, fileName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name or position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-md w-full"
        />

        <button
          onClick={handleSearch}
          className={`bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 hover:bg-blue-500 ${
            searchLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={searchLoading}
        >
          {searchLoading ? "Searching..." : "Search"}
        </button>
        <button
          onClick={downloadEmployeeList}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
        >
          Download List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div
              key={employee.employee_id}
              className="p-4 border rounded shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center"
            >
              <img
                src={employee.profile_picture || "/default-profile.png"}
                alt={`${employee.first_name} ${employee.last_name}`}
                className="w-20 h-20 rounded-full mb-4"
              />
              <p className="font-bold text-lg mb-1">
                {employee.first_name} {employee.last_name}
              </p>
              <p className="text-sm text-gray-500">
                {employee.position || "N/A"}
              </p>
              <p>Email: {employee.email || "N/A"}</p>
              <p>Phone: {employee.phone || "N/A"}</p>
              <p>Nationality: {employee.nationality || "N/A"}</p>
              <p>State of Origin: {employee.state_of_origin || "N/A"}</p>
              <p>LGA of Origin: {employee.lga_of_origin || "N/A"}</p>
              <p>Employment Date: {employee.employment_date || "N/A"}</p>
              <p>Grade Level: {employee.grade_level || "N/A"}</p>
              <p>Qualification: {employee.qualification || "N/A"}</p>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center text-gray-500">No profiles found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentAdmin;

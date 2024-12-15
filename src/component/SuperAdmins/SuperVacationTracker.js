import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { SunIcon } from '@heroicons/react/24/outline'; // Vacation-themed icons
import BackFunction from '../MinistryDashboard/Backfunction';

const VacationTracker = () => {
  const [ministries, setMinistries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [employeesOnVacation, setEmployeesOnVacation] = useState([]);
  const [employeesNextVacation, setEmployeesNextVacation] = useState([]);
  const [employeesJustReturned, setEmployeesJustReturned] = useState([]);
  const [loading, setLoading] = useState(false);

  // Role and access data
  const employeeId = localStorage.getItem('employee_id'); // Retrieve employee ID from local storage
  const [role, setRole] = useState(null); // User's role (`is_admin`, `admin_ministry`, or `super_admin`)
  const [accessibleMinistry, setAccessibleMinistry] = useState(null);
  const [accessibleDepartment, setAccessibleDepartment] = useState(null);

  // Fetch user role and access
  useEffect(() => {
    const fetchUserAccess = async () => {
      const { data, error } = await supabase
        .from('access_level')
        .select('access_id, ministry_id, department_id')
        .eq('employee_id', employeeId)
        .single(); // Assuming one role per employee

      if (error) {
        console.error("Error fetching user access:", error.message);
      } else {
        const { access_id, ministry_id, department_id } = data;

        // Set role and accessible ministries/departments
        setRole(access_id === 3 ? 'super_admin' : access_id === 2 ? 'admin_ministry' : 'is_admin');
        setAccessibleMinistry(ministry_id);
        setAccessibleDepartment(department_id);
      }
    };

    fetchUserAccess();
  }, [employeeId]);

  // Fetch ministries based on the `is_admin` role
  useEffect(() => {
    const fetchMinistries = async () => {
      const { data, error } = await supabase
        .from('ministries')
        .select('id, name');

      if (error) {
        console.error("Error fetching ministries:", error.message);
      } else {
        if (role === 'super_admin') {
          setMinistries(data); // No restrictions for super_admin
        } else if (role === 'admin_ministry') {
          // Restrict to the ministry where the user is assigned
          setMinistries(data.filter(ministry => ministry.id === accessibleMinistry));
        } else if (role === 'is_admin') {
          // Restrict to the ministry assigned to the user (access_id 1)
          setMinistries(data.filter(ministry => ministry.id === accessibleMinistry));
        }
      }
    };

    if (role) fetchMinistries();
  }, [role, accessibleMinistry]);

  // Fetch departments based on selected ministry
  useEffect(() => {
    if (selectedMinistry) {
      const fetchDepartments = async () => {
        const { data, error } = await supabase
          .from('departments')
          .select('id, name')
          .eq('ministry_id', selectedMinistry);

        if (error) {
          console.error("Error fetching departments:", error.message);
        } else {
          if (role === 'is_admin') {
            // Restrict to the department where the user is assigned
            setDepartments(data.filter(department => department.id === accessibleDepartment));
          } else if (role === 'admin_ministry') {
            // Admin Ministry has access to all departments in the selected ministry
            setDepartments(data);
          } else {
            // Super Admin can access all departments
            setDepartments(data);
          }
        }
      };

      fetchDepartments();
    }
  }, [selectedMinistry, role, accessibleDepartment]);

  // Fetch vacation data based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      const fetchVacationData = async () => {
        setLoading(true);

        const { data, error } = await supabase
          .from("employee_leave")
          .select(`
            id,
            leave_type,
            start_date,
            end_date,
            employee_profiles (id, first_name, last_name, profile_picture)
          `)
          .eq("department_id", selectedDepartment);

        if (error) {
          console.error("Error fetching vacation data:", error.message);
        } else {
          console.log("Fetched Vacation Data:", data);

          const { onVacation, nextVacation, justReturned } = categorizeVacationData(data);

          setEmployeesOnVacation(onVacation);
          setEmployeesNextVacation(nextVacation);
          setEmployeesJustReturned(justReturned);
        }

        setLoading(false);
      };

      fetchVacationData();
    }
  }, [selectedDepartment]);

  const categorizeVacationData = (data) => {
    const currentDate = new Date();
    const onVacation = [];
    const nextVacation = [];
    const justReturned = [];

    data.forEach((leave) => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);

      if (startDate <= currentDate && currentDate <= endDate) {
        // Employee is currently on vacation
        onVacation.push(leave);
      } else if (
        startDate > currentDate &&
        startDate <= new Date(currentDate.setDate(currentDate.getDate() + 7))
      ) {
        // Employee's vacation starts within the next 7 days
        nextVacation.push(leave);
      } else if (endDate < currentDate && currentDate - endDate <= 48 * 60 * 60 * 1000) {
        // Employee returned from vacation within the last 48 hours
        justReturned.push(leave);
      }
    });

    return { onVacation, nextVacation, justReturned };
  };

  const handleMinistryChange = (e) => {
    setSelectedMinistry(e.target.value);
    setSelectedDepartment('');
    setDepartments([]);
    setEmployeesOnVacation([]);
    setEmployeesNextVacation([]);
    setEmployeesJustReturned([]);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const renderEmployeeCard = (employee) => {
    const profile = employee.employee_profiles;
    if (!profile) {
      return <p>No employee data available</p>;
    }

    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer">
        <div className="relative">
          <img
            src={profile.profile_picture || "/default-avatar.jpg"}
            alt={`${profile.first_name} ${profile.last_name}`}
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <SunIcon className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        <h3 className="font-semibold text-lg">{`${profile.first_name} ${profile.last_name}`}</h3>
        <p className="text-gray-500">{employee.leave_type}</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Employee Vacation Tracker</h2>
      <BackFunction />
      
      {/* Ministry and Department Selectors */}
      <div className="flex justify-between mb-6">
        <select
          value={selectedMinistry}
          onChange={handleMinistryChange}
          className="p-2 border rounded-lg flex-1 mr-2"
        >
          <option value="">Select Ministry</option>
          {ministries.length > 0 ? (
            ministries.map(ministry => (
              <option key={ministry.id} value={ministry.id}>
                {ministry.name}
              </option>
            ))
          ) : (
            <option value="">No Ministries Available</option>
          )}
        </select>

        {selectedMinistry && (
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="p-2 border rounded-lg flex-1"
          >
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        )}
      </div>
{/* "Next Vacation" employees - Row at the top */}
{employeesNextVacation.length > 0 && (
  <div className="mb-4 p-2 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-white text-center mb-2">
      Next Vacation
    </h3>

    <div className="flex overflow-x-auto space-x-4 py-2 items-center">
      {employeesNextVacation.map((employeeCard, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" // Square card sizes
        >
          <div className="w-full h-full overflow-hidden rounded-full">
            {renderEmployeeCard(employeeCard)}
          </div>
        </div>
      ))}
    </div>
  </div>
)}


      {employeesOnVacation.length > 0 && (
  <div className="mb-6 border p-6 rounded-lg bg-blue-100">
    <h3 className="text-xl font-semibold text-center">On Vacation</h3>
    <div className="flex flex-wrap justify-center gap-4">
      {employeesOnVacation.map((employee, index) => (
        <div
          key={index}
          className="flex-1 min-w-[250px] max-w-[400px] p-2"
        >
          {renderEmployeeCard(employee)}
        </div>
      ))}
    </div>
  </div>
)}
{/* "Just Returned" employees - On the right side with separation */}
{employeesJustReturned.length > 0 && (
  <div className="border-l-2 border-gray-300 pl-6 ml-6">
    <h3 className="text-xl font-semibold text-center mb-4">Just Returned</h3>
    <div className="flex flex-wrap justify-center gap-4">
      {employeesJustReturned.map((employeeCard, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56" // Responsive card sizing
        >
          {renderEmployeeCard(employeeCard)}
        </div>
      ))}
    </div>
  </div>
)}


      {/* Loading Spinner */}
      {loading && (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default VacationTracker;

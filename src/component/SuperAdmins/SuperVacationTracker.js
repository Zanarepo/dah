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

  // Fetch ministries data
  useEffect(() => {
    const fetchMinistries = async () => {
      const { data, error } = await supabase
        .from('ministries')
        .select('id, name');

      if (error) {
        console.error("Error fetching ministries:", error.message);
      } else {
        setMinistries(data);
      }
    };

    fetchMinistries();
  }, []);

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
          setDepartments(data);
        }
      };

      fetchDepartments();
    }
  }, [selectedMinistry]);

  // Fetch vacation data for selected department
  useEffect(() => {
    if (selectedDepartment) {
      const fetchVacationData = async () => {
        setLoading(true);

        const { data, error } = await supabase
          .from('employee_leave')
          .select(`
            id,
            leave_type,
            start_date,
            end_date,
            employee_profiles (id, first_name, last_name, profile_picture)
          `)
          .eq('department_id', selectedDepartment);

        if (error) {
          console.error("Error fetching vacation data:", error.message);
        } else {
          const currentDate = new Date();
          const onVacation = [];
          const nextVacation = [];
          const justReturned = [];

          data.forEach(leave => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);

            // On vacation
            if (startDate <= currentDate && currentDate <= endDate) {
              onVacation.push(leave);
            }
            // Going on vacation soon (within the next week)
            else if (startDate > currentDate && startDate <= new Date(currentDate.setDate(currentDate.getDate() + 7))) {
              nextVacation.push(leave);
            }
            // Just returned (within the past 48 hours)
            else if (endDate < currentDate && currentDate - endDate <= 48 * 60 * 60 * 1000) {
              justReturned.push(leave);
            }
          });

          setEmployeesOnVacation(onVacation);
          setEmployeesNextVacation(nextVacation);
          setEmployeesJustReturned(justReturned);
        }

        setLoading(false);
      };

      fetchVacationData();
    }
  }, [selectedDepartment]);

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

  if (loading) return <p>Loading vacation data...</p>;

  const renderEmployeeCard = (employee) => (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer">
      <div className="relative">
        <img
          src={employee.employee_profiles.profile_picture || "/default-avatar.jpg"}
          alt={`${employee.employee_profiles.first_name} ${employee.employee_profiles.last_name}`}
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <SunIcon className="w-6 h-6 text-yellow-500" />
        </div>
      </div>
      <h3 className="font-semibold text-lg">{`${employee.employee_profiles.first_name} ${employee.employee_profiles.last_name}`}</h3>
      <p className="text-gray-500">{employee.leave_type}</p>
    </div>
  );
 
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Employee Vacation Tracker</h2>
      <BackFunction/>
      <div className="mb-6">
        {/* Ministry Selection */}
        <select
          value={selectedMinistry}
          onChange={handleMinistryChange}
          className="mb-4 p-2 border rounded-lg"
        >
          <option value="">Select Ministry</option>
          {ministries.map(ministry => (
            <option key={ministry.id} value={ministry.id}>
              {ministry.name}
            </option>
          ))}
        </select>

        {/* Department Selection */}
        {selectedMinistry && (
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="p-2 border rounded-lg"
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

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Section: Next Vacation */}
        <section className={`bg-yellow-100 p-6 rounded-lg shadow-md lg:col-span-1 ${employeesOnVacation.length === 0 ? 'lg:col-span-3' : ''}`}>
          <h3 className="text-xl font-semibold mb-4 text-yellow-700">Next Vacation</h3>
          <div className="space-y-4">
            {employeesNextVacation.length > 0 ? (
              employeesNextVacation.map(employee => renderEmployeeCard(employee))
            ) : (
              <p>No employees are going on vacation soon.</p>
            )}
          </div>
        </section>

        {/* Center Section: On Vacation (Larger Section) */}
        <section className={`col-span-1 lg:col-span-3 bg-blue-100 p-6 rounded-lg shadow-md ${employeesNextVacation.length === 0 ? 'lg:col-span-3' : ''}`}>
          <h3 className="text-xl font-semibold mb-4 text-blue-700">On Vacation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {employeesOnVacation.length > 0 ? (
              employeesOnVacation.map(employee => renderEmployeeCard(employee))
            ) : (
              <p>No employees currently on vacation.</p>
            )}
          </div>
        </section>

        {/* Right Section: Just Returned */}
        <section className="bg-green-100 p-6 rounded-lg shadow-md lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Just Returned</h3>
          <div className="space-y-4">
            {employeesJustReturned.length > 0 ? (
              employeesJustReturned.map(employee => renderEmployeeCard(employee))
            ) : (
              <p>No employees have recently returned from vacation.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VacationTracker;

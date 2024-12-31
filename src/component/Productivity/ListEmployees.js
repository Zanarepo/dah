import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const DepartmentEmployeeManager = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    // Fetch all departments
    useEffect(() => {
        const fetchDepartments = async () => {
            const { data, error } = await supabase
                .from('departments')
                .select('*');

            if (error) {
                console.error('Error fetching departments:', error);
            } else {
                setDepartments(data);
            }
        };

        fetchDepartments();
    }, []);

    // Fetch employees when a department is selected
    useEffect(() => {
        if (!selectedDepartment) {
            setEmployees([]);
            return;
        }

        const fetchEmployees = async () => {
            const { data, error } = await supabase
                .from('employee_profiles')
                .select('employee_id, first_name, last_name')
                .eq('department_id', selectedDepartment);

            if (error) {
                console.error('Error fetching employees:', error);
            } else {
                setEmployees(data);
            }
        };

        fetchEmployees();
    }, [selectedDepartment]);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-6">
            <h2 className="text-2xl font-semibold mb-4">Department and Employees</h2>

            {/* Department Dropdown */}
            <div className="relative w-full max-w-md mb-6">
                <label className="block text-gray-700 mb-2">Select a Department:</label>
                <select
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={selectedDepartment || ''}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <option value="" disabled>
                        -- Select Department --
                    </option>
                    {departments.map((dept) => (
                        <option key={dept.department_id} value={dept.department_id}>
                            {dept.department_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Employee List */}
            <div className="w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Employees</h3>
                {employees.length > 0 ? (
                    <ul className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                        {employees.map((emp) => (
                            <li key={emp.employee_id} className="py-2 border-b last:border-none">
                                {emp.first_name} {emp.last_name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        {selectedDepartment
                            ? 'No employees found for the selected department.'
                            : 'Please select a department to view employees.'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default DepartmentEmployeeManager;

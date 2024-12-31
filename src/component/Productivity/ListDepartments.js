// Component: ListDepartments.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const ListDepartments = () => {
    const [departments, setDepartments] = useState([]);

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

    return (
        <div>
            <h2>Departments</h2>
            <ul>
                {departments.map(dept => (
                    <li key={dept.department_id}>{dept.department_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ListDepartments;
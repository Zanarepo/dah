import React from 'react';
import { supabase } from "../../supabaseClient";

const PopulateDepartments = () => {
    const handlePopulate = async () => {
        const departments = [
            {
                name: 'Department of Art', 
                ministry_id: 2,  // Ensure you use correct ministry ID
              
               
            },
            {
                name: 'Department of Science', 
                ministry_id: 8,  // Correct ministry ID
               
            },
            // Add more departments as needed
        ];

        try {
            const { data, error } = await supabase.from('departments').insert(departments);

            if (error) {
                console.error('Error inserting departments:', error.message);
            } else {
                console.log('Departments inserted successfully:', data);
                alert('Departments inserted successfully!');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    return (
        <div>
            <button
                onClick={handlePopulate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Populate Departments
            </button>
        </div>
    );
};

export default PopulateDepartments;

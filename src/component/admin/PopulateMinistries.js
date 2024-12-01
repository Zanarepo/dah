import React from 'react';
import { supabase } from "../../supabaseClient";

const PopulateMinistries = () => {
    const handlePopulate = async () => {
        const ministries = [
         
            {
                name: 'Ministry of Education',
                admin_id: 2,
                contact_email: 'education@ministry.gov',
                contact_phone: '+1234567891',
                address: '456 Education Avenue, City',
            },
            // Add more ministries as needed
        ];

        try {
            const { data, error } = await supabase.from('ministries').insert(ministries);

            if (error) {
                console.error('Error inserting ministries:', error.message);
            } else {
                console.log('Ministries inserted successfully:', data);
                alert('Ministries inserted successfully!');
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
                Populate Ministries
            </button>
        </div>
    );
};

export default PopulateMinistries;

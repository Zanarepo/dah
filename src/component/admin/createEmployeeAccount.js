// src/api.js or src/supabaseAPI.js
import { supabase } from './supabaseClient';

export const createEmployeeAccount = async (employeeId, temporaryPassword, whatsappNumber) => {
  const { data, error } = await supabase
    .from('employee_accounts')
    .insert([
      {
        employee_id: employeeId,
        temporary_password: temporaryPassword,
        whatsapp_number: whatsappNumber,
        account_status: 'Pending',
      },
    ]);

  if (error) {
    console.error("Error inserting employee account: ", error);
    return false;
  }

  console.log("Employee account created successfully:", data);
  return true;
};

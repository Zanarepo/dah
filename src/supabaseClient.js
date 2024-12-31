import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Set employee_id (sender_id) in the session for RLS
export const setEmployeeIdInSession = () => {
  const employeeId = localStorage.getItem('employee_id');
  if (employeeId) {
    // Call the function to set the employee_id in session
    supabase.rpc('set_employee_id', { sender_id: parseInt(employeeId) });
  }
};

// Call this function as early as possible (e.g., in App.js useEffect or when the user logs in)
setEmployeeIdInSession();


export default setEmployeeIdInSession; // Default export

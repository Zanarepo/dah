import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabaseClient';

const AttendanceMessage = () => {
  const [message, setMessage] = useState('');

  const fetchEmployeeName = async (employeeId) => {
    const { data, error } = await supabase
      .from('employee_profiles')
      .select('first_name')
      .eq('employee_id', employeeId)
      .single();

    return error ? null : data?.first_name;
  };

  const determineGreeting = (name, type, time) => {
    const hours = new Date(time).getHours();

    if (type === 'check_in') {
      if (hours >= 0 && hours < 12) {
        return `Good morning, ${name}. Do have a great day at work.`;
      } else if (hours >= 12 && hours < 18) {
        return `Good afternoon, ${name}. Have a productive day!`;
      } else {
        return `Good evening, ${name}. Enjoy your evening at work.`;
      }
    } else if (type === 'check_out') {
      if (hours >= 18 || hours < 6) {
        return `Goodbye, ${name}. See you soon.`;
      } else {
        return `Going so soon? Bye, and have a great day!`;
      }
    }
  };

  const handleAttendanceEvent = useCallback(async () => {
    const employeeId = localStorage.getItem('employee_id');

    if (!employeeId) {
      console.warn('No employee_id found in localStorage.');
      return;
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('check_in_time, check_out_time')
      .eq('employee_id', employeeId)
      .order('check_in_time', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching attendance data:', error);
      return;
    }

    if (!data) {
      console.warn('No attendance data found for employee:', employeeId);
      return;
    }

    const { check_in_time, check_out_time } = data;
    const name = await fetchEmployeeName(employeeId);

    if (!name) {
      console.warn('Employee name could not be fetched.');
      return;
    }

    if (check_in_time && !check_out_time) {
      setMessage(determineGreeting(name, 'check_in', check_in_time));
    } else if (check_out_time) {
      setMessage(determineGreeting(name, 'check_out', check_out_time));
    }
  }, []);  // Empty dependency array ensures this is stable

  useEffect(() => {
    handleAttendanceEvent();
  }, [handleAttendanceEvent]);  // Now handleAttendanceEvent is stable

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(''); // Clear the message after 5 seconds
      }, 5000); // 5000 ms for 5 seconds

      // Clean up the timeout on component unmount or message change
      return () => clearTimeout(timeout);
    }
  }, [message]);  // This effect depends on the message state

  return (
    <div>
      {message && (
        <div
          className="fixed top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/4 bg-blue-500 text-white text-center py-2 px-4 rounded shadow-md z-50"
          style={{ minWidth: '300px' }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AttendanceMessage;

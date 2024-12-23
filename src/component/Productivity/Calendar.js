import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { supabase } from '../../supabaseClient'; // Correct import
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const AttendanceCalendar = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const colors = {
    checkedInOut: 'bg-green-500', // Checked in and checked out
    checkedInOnly: 'bg-yellow-500', // Checked in but didn't check out
    noCheckIn: 'bg-red-500', // Didn't check in
  };

  // Fetch Attendance Data
  const fetchAttendanceData = async () => {
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) {
      console.error('Employee ID not found.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .order('check_in_time', { ascending: false })
        .limit(31); // Limit to last 31 days or as needed

      if (error) {
        console.error('Error fetching attendance data:', error);
        return;
      }

      // Format the data to extract only the date portion (YYYY-MM-DD)
      const formattedData = data.map((entry) => {
        const checkInDate = new Date(entry.check_in_time).toISOString().split('T')[0]; // YYYY-MM-DD
        const checkOutDate = entry.check_out_time
          ? new Date(entry.check_out_time).toISOString().split('T')[0]
          : null;

        return {
          date: checkInDate, // Store only the date in YYYY-MM-DD format
          checkIn: entry.check_in_time,
          checkOut: checkOutDate,
        };
      });

      setAttendanceData(formattedData);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();

    // Real-time subscription using Supabase's real-time feature
    const attendanceChannel = supabase
      .channel('attendance')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'attendance' }, (payload) => {
        console.log('Real-time insert update payload:', payload);
        fetchAttendanceData(); // Re-fetch data on insert
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'attendance' }, (payload) => {
        console.log('Real-time update payload:', payload);
        fetchAttendanceData(); // Re-fetch data on update
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'attendance' }, (payload) => {
        console.log('Real-time delete update payload:', payload);
        fetchAttendanceData(); // Re-fetch data on delete
      })
      .subscribe();

    // Cleanup the subscription when the component is unmounted
    return () => {
      supabase.removeChannel(attendanceChannel);
    };
  }, []); // Empty array to run the effect only on mount

  // Get color status for each day
  const getDayStatus = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

    // Check if there is any attendance record for this day
    const attendance = attendanceData.find((entry) => entry.date === formattedDate);

    if (!attendance) {
      return colors.noCheckIn; // No check-in for this day, mark as red
    }

    if (attendance.checkIn && attendance.checkOut) {
      return colors.checkedInOut; // Successfully checked in and out
    }

    if (attendance.checkIn && !attendance.checkOut) {
      return colors.checkedInOnly; // Checked in but did not check out
    }

    return colors.noCheckIn; // Default: No check-in
  };

  // Handle date change (for selecting specific date)
  const handleDateChange = (date) => {
    setSelectedDate(date); // Update selected date when user selects a date
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Attendance Calendar</h1>
      {loading && <p className="text-center">Loading...</p>}

      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange} // Handle date selection
          value={selectedDate} // Selected date
          tileClassName={({ date }) => getDayStatus(date)} // Apply color based on status
        />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Color Key</h3>
        <ul className="list-inside">
          <li className="flex items-center">
            <div className={`h-5 w-5 rounded-full ${colors.checkedInOut} mr-2`}></div>
            <span>Checked in and checked out successfully</span>
          </li>
          <li className="flex items-center">
            <div className={`h-5 w-5 rounded-full ${colors.noCheckIn} mr-2`}></div>
            <span>Did not check in</span>
          </li>
          <li className="flex items-center">
            <div className={`h-5 w-5 rounded-full ${colors.checkedInOnly} mr-2`}></div>
            <span>Checked in but did not check out</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AttendanceCalendar;

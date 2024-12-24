import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust import as needed
import { toast } from 'react-toastify';
import AttendanceMessage from './AttendanceMessage';

const Attendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);
  const [accessDetails, setAccessDetails] = useState(null);

  const WORK_LOCATION = {
    latitude: 6.4520192,
    longitude: 3.4275328,
    radius: 50, // 50 meters radius


  
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Convert to meters
    return distance;
  };

  const isInWorkLocation = useCallback((lat, lon) => {
    const distance = calculateDistance(lat, lon, WORK_LOCATION.latitude, WORK_LOCATION.longitude);
    return distance <= WORK_LOCATION.radius;
  }, [WORK_LOCATION.latitude, WORK_LOCATION.longitude, WORK_LOCATION.radius]);

  // Fetch employee's department_id and ministry_id
  useEffect(() => {
    const fetchAccessDetails = async () => {
      const employeeId = localStorage.getItem('employee_id'); 
      if (!employeeId) {
        toast.error('Employee ID not found.');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('employee_profiles')
          .select('department_id, ministry_id')
          .eq('employee_id', employeeId)
          .single();

        if (error || !data) {
          console.error('Error fetching access details:', error);
          toast.error('Access details not found.');
        } else {
          setAccessDetails(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching access details:', err);
        toast.error('Error fetching access details.');
      }
    };

    fetchAccessDetails();
  }, []);

  // Fetch last attendance record
  const fetchLastAttendance = useCallback(async () => {
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) {
      toast.error('Employee ID not found.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .is('check_out_time', null)
        .order('check_in_time', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        setAttendance(null);
      } else {
        setAttendance(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching last attendance:', err);
      toast.error('Error fetching last attendance.');
    }
  }, []);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error('Geolocation not supported by this browser.');
        reject(new Error('Geolocation not supported'));
      } else {
        const options = { timeout: 10000 }; // 10-second timeout
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error.message);
            toast.error('Error getting location: ' + error.message);
            reject(error);
          },
          options
        );
      }
    });
  }, []);

  // Handle Check-In
  const handleCheckIn = useCallback(async () => {
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId || !accessDetails) {
      toast.error('Employee ID or access details not available.');
      return;
    }

    setLoadingCheckIn(true);
    try {
      const loc = await getLocation();

      // Check if the employee is within the work location
      if (!isInWorkLocation(loc.latitude, loc.longitude)) {
        toast.error('You must be within the office/work location to check in.');
        return;
      }

      // If the employee has an unfinished session, reset it
      if (attendance && !attendance.check_out_time) {
        await supabase
          .from('attendance')
          .update({ check_out_time: null })
          .eq('attendance_id', attendance.attendance_id); // Reset previous check-out
      }

      // Insert the new check-in record
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          employee_id: employeeId,
          department_id: accessDetails.department_id,
          ministry_id: accessDetails.ministry_id,
          check_in_time: new Date().toISOString(),
          check_out_time: null,
          latitude: loc.latitude,
          longitude: loc.longitude,
        }])
        .select();

      if (error) {
        console.error('Error during check-in:', error);
        toast.error('Error checking in.');
      } else if (data && data.length > 0) {
        toast.success('Checked in successfully recorded!');
        setAttendance(data[0]);
      }
    } catch (err) {
      console.error('Unexpected error during check-in:', err);
      toast.error('Unexpected error during check-in.');
    } finally {
      setLoadingCheckIn(false);
    }
  }, [accessDetails, getLocation, isInWorkLocation, attendance]); // Add attendance to the dependency array

  // Handle Check-Out
  const handleCheckOut = useCallback(async () => {
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) {
      toast.error('Employee ID not available.');
      return;
    }

    setLoadingCheckOut(true);
    try {
      const { data: attendanceData, error: fetchError } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .is('check_out_time', null)
        .order('check_in_time', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !attendanceData) {
        console.error('No active check-in found:', fetchError);
        toast.error('No active check-in record found.');
      } else {
        const { attendance_id } = attendanceData;
        const { error: updateError } = await supabase
          .from('attendance')
          .update({ check_out_time: new Date().toISOString() })
          .eq('attendance_id', attendance_id);

        if (updateError) {
          console.error('Error during check-out:', updateError);
          toast.error('Error during check-out.');
        } else {
          toast.success('Checked out successfully recorded!');
          setAttendance(null);
        }
      }
    } catch (err) {
      console.error('Unexpected error during check-out:', err);
      toast.error('Unexpected error during check-out.');
    } finally {
      setLoadingCheckOut(false);
    }
  }, []);

  useEffect(() => {
    fetchLastAttendance();

    // Reset check-in time if after 6 PM and no check-out has been done
    if (attendance && !attendance.check_out_time && new Date().getHours() >= 18) {
      const resetAttendance = async () => {
        await supabase
          .from('attendance')
          .update({ check_in_time: null, check_out_time: null })
          .eq('attendance_id', attendance.attendance_id);
      };
      resetAttendance();
    }
  }, [fetchLastAttendance, attendance]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>
      <AttendanceMessage />
      {attendance ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <p className="text-lg">
              <strong>Check-In Time:</strong>{' '}
              {attendance.check_in_time ? new Date(attendance.check_in_time).toLocaleString() : 'Not checked in'}
            </p>
            <p className="text-lg">
              <strong>Check-Out Time:</strong>{' '}
              {attendance.check_out_time ? new Date(attendance.check_out_time).toLocaleString() : 'Not checked out'}
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={attendance.check_out_time ? null : handleCheckOut}
              disabled={loadingCheckOut || attendance.check_out_time}
              className={`bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 disabled:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105 ${
                loadingCheckOut ? 'cursor-wait' : 'cursor-pointer'
              }`}
            >
              {loadingCheckOut ? 'Checking Out...' : attendance.check_out_time ? 'Checked Out' : 'Check-Out'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleCheckIn}
            disabled={loadingCheckIn}
            className={`bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105 ${
              loadingCheckIn ? 'cursor-wait' : 'cursor-pointer'
            }`}
          >
            {loadingCheckIn ? 'Checking In...' : 'Check-In'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Attendance;

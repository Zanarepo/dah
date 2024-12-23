import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient"; // Assume supabase is set up in a utils folder
import { toast } from 'react-toastify';
const EmployeeAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [departmentDetails, setDepartmentDetails] = useState(null);
    const [ministryDetails, setMinistryDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeId] = useState(localStorage.getItem('employee_id'));
  
    // New state for storing attendance statistics
    const [attendanceStats, setAttendanceStats] = useState({
      attendedDays: 0,
      absences: 0,
      attendanceRate: 0,
    });
  
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
  
    useEffect(() => {
      const fetchAttendance = async () => {
        setLoading(true);
        try {
          const employeeId = localStorage.getItem('employee_id');
          if (!employeeId) {
            toast.error('Employee ID not found.');
            setLoading(false);
            return;
          }
  
          // Fetch employee details only once
          const { data: employeeData, error: employeeError } = await supabase
            .from('employee_profiles')
            .select('first_name, last_name, department_id, ministry_id')
            .eq('employee_id', employeeId)
            .single();
  
          if (employeeError || !employeeData) {
            toast.error('Employee details not found.');
            setLoading(false);
            return;
          }
  
          setEmployeeDetails(employeeData);
  
          // Fetch department and ministry names only once
          const { data: departmentData, error: departmentError } = await supabase
            .from('departments')
            .select('name')
            .eq('id', employeeData.department_id)
            .single();
  
          const { data: ministryData, error: ministryError } = await supabase
            .from('ministries')
            .select('name')
            .eq('id', employeeData.ministry_id)
            .single();
  
          if (departmentError || !departmentData) {
            toast.error('Department details not found.');
          }
          if (ministryError || !ministryData) {
            toast.error('Ministry details not found.');
          }
  
          setDepartmentDetails(departmentData || {});
          setMinistryDetails(ministryData || {});
  
          // Fetch attendance records for the logged-in employee
          const { data: attendanceData, error: attendanceError } = await supabase
            .from('attendance')
            .select('employee_id, department_id, ministry_id, check_in_time, check_out_time, attendance_id')
            .eq('employee_id', employeeId);
  
          if (attendanceError) {
            toast.error('Error fetching attendance records.');
            setError(attendanceError.message);
          } else {
            setAttendanceData(attendanceData || []);
            // Compute attendance statistics
            const attendedDays = attendanceData.filter(
              (attendance) => attendance.check_out_time
            ).length; // Count records with check_out_time
            
            const absences = attendanceData.filter(
              (attendance) => !attendance.check_out_time
            ).length; // Count records without check_out_time
  
            const totalDays = attendanceData.length; // Total records fetched
            const attendanceRate = totalDays > 0 ? (attendedDays / totalDays) * 100 : 0;
  
            // Update the state with computed statistics
            setAttendanceStats({ attendedDays, absences, attendanceRate });
          }
        } catch (err) {
          console.error(err);
          toast.error('An error occurred while fetching attendance.');
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAttendance();
    }, [employeeId]); // Only rerun when `employeeId` changes
    // Remaining code for pagination
    const paginateData = () => {
      const startIdx = (currentPage - 1) * rowsPerPage;
      return attendanceData.slice(startIdx, startIdx + rowsPerPage);
    };
  
    const handlePrevPage = () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
  
    const handleNextPage = () => {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(attendanceData.length / rowsPerPage)));
    };
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Attendance Summary</h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="bg-white-600 p-6 rounded-lg shadow-lg text-white flex flex-col items-center space-y-4">
            <div className="w-full sm:w-3/4 md:w-1/2 p-4 bg-blue-700 rounded-lg shadow-sm space-y-3">
              <p className="text-lg">
                <strong>Name:</strong> {employeeDetails?.first_name} {employeeDetails?.last_name}
              </p>
              <p className="text-lg">
                <strong>Department:</strong> {departmentDetails?.name || 'N/A'}
              </p>
              <p className="text-lg">
                <strong>Ministry:</strong> {ministryDetails?.name || 'N/A'}
              </p>
              <p className="text-lg">
                <strong>Total Days Attended:</strong> {attendanceStats.attendedDays}
              </p>
              <p className="text-lg">
                <strong>Absences:</strong> {attendanceStats.absences}
              </p>
              <p className="text-lg font-semibold">
                <strong>Attendance Rate:</strong> {attendanceStats.attendanceRate.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-4">
            <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
            <table className="min-w-full table-auto">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 border-b text-left">Employee Name</th>
                  <th className="px-4 py-2 border-b text-left">Check-In Time</th>
                  <th className="px-4 py-2 border-b text-left">Check-Out Time</th>
                </tr>
              </thead>
              <tbody>
                {paginateData()
                  .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time)) // Sort records by check-in time (newest first)
                  .map((attendance) => (
                    <tr
                      key={attendance.attendance_id}
                      className={`hover:bg-gray-50 ${
                        !attendance.check_out_time ? 'bg-red-100' : ''
                      }`} // Missed checkout will have a different color
                    >
                      <td className="px-4 py-2 border-b">
                        {employeeDetails?.first_name} {employeeDetails?.last_name}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {attendance.check_in_time
                          ? new Date(attendance.check_in_time).toLocaleString()
                          : 'Not Checked In'}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {attendance.check_out_time
                          ? new Date(attendance.check_out_time).toLocaleString()
                          : 'Not Checked Out'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <p className="text-lg">
              Page {currentPage} of {Math.ceil(attendanceData.length / rowsPerPage)}
            </p>
            <button
              onClick={handleNextPage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={currentPage === Math.ceil(attendanceData.length / rowsPerPage)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeAttendance;

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const OnVacation = () => {
  const [onVacationEmployees, setOnVacationEmployees] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Memoize the function to avoid unnecessary re-renders
  const fetchDepartmentAdminId = useCallback(async () => {
    const adminEmployeeId = localStorage.getItem("employee_id");

    if (!adminEmployeeId) {
      setError("You are not logged in.");
      return;
    }

    try {
      const { data: adminData, error: adminError } = await supabase
        .from("department_admins")
        .select("department_id")
        .eq("employee_id", adminEmployeeId)
        .maybeSingle();

      if (adminError) {
        throw new Error(adminError.message);
      }

      if (!adminData) {
        setError("You are not assigned to any department.");
        return;
      }

      fetchOnVacationEmployees(adminData.department_id);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch department information.");
    }
  }, []); // Empty dependency array ensures it's not recreated on each render

  // Fetch employees currently on vacation within the specific department
  const fetchOnVacationEmployees = async (departmentId) => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

      const { data, error } = await supabase
        .from("employee_leave")
        .select(
          `employee_id, start_date, end_date, leave_type, employee_profiles!employee_leave_employee_id_fkey(first_name, last_name, profile_picture, department_id, departments(name))`
        )
        .lte("start_date", currentDate)
        .gte("end_date", currentDate)
        .eq("status", "Approved")
        .eq("employee_profiles.department_id", departmentId);

      if (error) throw error;

      const filteredData = data.filter((employee) => employee.employee_profiles !== null);
      setOnVacationEmployees(filteredData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees on vacation.");
    }
  };

  useEffect(() => {
    fetchDepartmentAdminId();
  }, [fetchDepartmentAdminId]); // Add fetchDepartmentAdminId to dependency array

  return (
    <div className="on-vacation-container bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex flex-col items-center p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white text-blue-500 px-4 py-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition"
      >
        Back
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Header */}
      <h2 className="text-4xl font-bold text-white mb-6">Employees On Vacation</h2>
      <p className="text-lg text-white text-center mb-12">
        These employees are currently on vacation. 🌴
      </p>

      {/* Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {onVacationEmployees.length === 0 ? (
          <p className="text-center text-white col-span-full">No employees on vacation.</p>
        ) : (
          onVacationEmployees.map((employee) => (
            <div
              key={employee.employee_id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full"
            >
              {/* Profile Picture */}
              <img
                src={employee.employee_profiles?.profile_picture || "/default-profile.png"}
                alt={`${employee.employee_profiles?.first_name} ${employee.employee_profiles?.last_name}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {employee.employee_profiles?.first_name} {employee.employee_profiles?.last_name}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Department:</strong> {employee.employee_profiles?.departments?.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Vacation:</strong> {employee.start_date} - {employee.end_date}
              </p>
              <div className="mt-4 text-4xl text-yellow-500">
                {employee.leave_type === "vacation" ? "🌴" : "🏖️"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <button className="bg-white text-blue-500 px-4 py-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition mx-2">
          Previous
        </button>
        <button className="bg-white text-blue-500 px-4 py-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition mx-2">
          Next
        </button>
      </div>
    </div>
  );
};

export default OnVacation;

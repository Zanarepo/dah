import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const OnVacation = () => {
  const [onVacationEmployees, setOnVacationEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [departmentAdminId, setDepartmentAdminId] = useState(null);
  const carouselRef = useRef(null);  // Ref for carousel to enable scrolling
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartmentAdminId();
  }, []);

  // Fetch the department_id for the logged-in user from department_admins table
  const fetchDepartmentAdminId = async () => {
    const adminEmployeeId = localStorage.getItem("employee_id");

    if (!adminEmployeeId) {
      setError("You are not logged in.");
      return;
    }

    try {
      const { data: adminData, error: adminError } = await supabase
        .from('department_admins')
        .select('department_id')
        .eq('employee_id', adminEmployeeId)
        .maybeSingle();

      if (adminError) {
        throw new Error(adminError.message);
      }

      if (!adminData) {
        setError('You are not assigned to any department.');
        return;
      }

      const departmentId = adminData.department_id;
      setDepartmentAdminId(departmentId);
      fetchOnVacationEmployees(departmentId);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch department information.");
    }
  };

  // Fetch employees currently on vacation within the specific department
  const fetchOnVacationEmployees = async (departmentId) => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

      const { data, error } = await supabase
        .from("employee_leave")
        .select(
          `employee_id, start_date, end_date, leave_type, employee_profiles!employee_leave_employee_id_fkey(first_name, last_name, profile_picture, department_id, departments(name))`
        )
        .lte("start_date", currentDate) // Leave has started
        .gte("end_date", currentDate) // Leave has not ended
        .eq("status", "Approved")
        .eq("employee_profiles.department_id", departmentId); // Filter by department_id

      if (error) throw error;

      // Filter out records where employee_profiles is null
      const filteredData = data.filter(employee => employee.employee_profiles !== null);

      setOnVacationEmployees(filteredData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees on vacation.");
    }
  };

  // Function to slide the carousel left
  const slideLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,  // Scroll by 300px to the left
        behavior: 'smooth',  // Smooth scrolling
      });
    }
  };

  // Function to slide the carousel right
  const slideRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,  // Scroll by 300px to the right
        behavior: 'smooth',  // Smooth scrolling
      });
    }
  };

  return (
    <div className="on-vacation-container bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex flex-col items-center relative p-6">
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

      {/* Carousel Container */}
      <div className="carousel-container w-full max-w-4xl overflow-hidden relative">
        {/* Card Wrapper with Sliding Effect */}
        <div
          ref={carouselRef}
          className="carousel-slide flex space-x-6 transition-transform duration-500 ease-in-out"
        >
          {onVacationEmployees.length === 0 ? (
            <p className="text-center text-white">No employees on vacation.</p>
          ) : (
            onVacationEmployees.map((employee) => (
              <div
                key={employee.employee_id}
                className="carousel-card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-64"
              >
                {/* Profile Picture */}
                <img
                  src={employee.employee_profiles?.profile_picture || "/default-profile.png"}
                  alt={`${employee.employee_profiles?.first_name} ${employee.employee_profiles?.last_name}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {employee.employee_profiles?.first_name}{" "}
                  {employee.employee_profiles?.last_name}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Department:</strong>{" "}
                  {employee.employee_profiles?.departments?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Vacation:</strong>{" "}
                  {employee.start_date} - {employee.end_date}
                </p>
                <div className="mt-4 text-4xl text-yellow-500">{employee.leave_type === 'vacation' ? '🌴' : '🏖️'}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Controls (Prev & Next buttons) */}
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
        <button
          onClick={slideLeft}
          className="bg-white text-blue-500 p-3 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition"
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
        <button
          onClick={slideRight}
          className="bg-white text-blue-500 p-3 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default OnVacation;

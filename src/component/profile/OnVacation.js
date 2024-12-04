import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const OnVacation = () => {
  const [onVacationEmployees, setOnVacationEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOnVacationEmployees();
  }, []);

  const fetchOnVacationEmployees = async () => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

      // Explicitly specify the foreign key relationship
      const { data, error } = await supabase
        .from("employee_leave")
        .select(
          `
          employee_id,
          start_date,
          end_date,
          employee_profiles!employee_leave_employee_id_fkey(first_name, last_name, profile_picture, department_id, departments(name))
        `
        )
        .lte("start_date", currentDate) // Leave has started
        .gte("end_date", currentDate) // Leave has not ended
        .eq("status", "Approved");

      if (error) throw error;

      setOnVacationEmployees(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees on vacation.");
    }
  };

  return (
    <div className="on-vacation-container p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Currently On Vacation
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {onVacationEmployees.length === 0 ? (
        <p className="text-center text-gray-500">No employees on vacation.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onVacationEmployees.map((employee) => (
            <div
              key={employee.employee_id}
              className="bg-white p-4 border rounded-lg shadow"
            >
              <div className="flex items-center">
                <img
                  src={employee.employee_profiles.profile_picture || "/default-profile.png"}
                  alt={`${employee.employee_profiles.first_name} ${employee.employee_profiles.last_name}`}
                  className="w-16 h-16 rounded-full mr-4 object-cover border"
                />
                <div>
                  <h3 className="text-lg font-bold">
                    {employee.employee_profiles.first_name}{" "}
                    {employee.employee_profiles.last_name}
                  </h3>
                  <p>
                    <strong>Department:</strong>{" "}
                    {employee.employee_profiles.departments.name}
                  </p>
                </div>
              </div>
              <p className="mt-2">
                <strong>Vacation Period:</strong>{" "}
                {employee.start_date} - {employee.end_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnVacation;

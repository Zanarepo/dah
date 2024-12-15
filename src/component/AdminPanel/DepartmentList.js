import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const MinistryList = ({ onSelectDepartment, onBack }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAccessLevels, setUserAccessLevels] = useState([]);
  const employeeId = localStorage.getItem("employee_id"); // Assuming employee_id is stored in local storage

  useEffect(() => {
    const fetchUserAccessLevels = async () => {
      setLoading(true);

      // Fetch user access levels for is_admin role
      const { data, error } = await supabase
        .from("access_level")
        .select("department_id, access_id")
        .eq("employee_id", employeeId);

      if (error) {
        console.error("Error fetching user access levels", error);
        setLoading(false);
        return;
      }

      setUserAccessLevels(data);
      setLoading(false);
    };

    fetchUserAccessLevels();
  }, [employeeId]);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);

      // Fetch all departments
      const { data, error } = await supabase
        .from("departments")
        .select("id, name, ministry_id");

      if (error) {
        console.error("Error fetching departments", error);
        setLoading(false);
        return;
      }

      // Filter departments based on is_admin access
      const filteredDepartments = data.filter((department) =>
        userAccessLevels.some(
          (access) => access.access_id === 1 && access.department_id === department.id
        )
      );

      setDepartments(filteredDepartments);
      setLoading(false);
    };

    if (userAccessLevels.length > 0) {
      fetchDepartments();
    }
  }, [userAccessLevels]);

  if (loading) return <p>Loading departments...</p>;

  return (
    <div className="department-list-container">
      <button
        className="text-blue-500 hover:text-blue-700 mb-4"
        onClick={onBack}
      >
        &larr; Back
      </button>
      <h2 className="text-xl font-bold mb-4">Select a Department</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {departments.map((department) => (
          <button
            key={department.id}
            onClick={() => onSelectDepartment(department)}
            className="p-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
          >
            {department.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MinistryList;

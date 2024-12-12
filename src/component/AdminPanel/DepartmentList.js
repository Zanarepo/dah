import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Backfunction from "../MinistryDashboard/MinistryDashboard"
const DepartmentList = ({ ministry, onSelectDepartment }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .eq("ministry_id", ministry.id);

      if (!error) setDepartments(data);
      setLoading(false);
    };
    fetchDepartments();
  }, [ministry.id]);

  if (loading) return <p>Loading departments...</p>;

  <Backfunction />
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Departments in {ministry.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {departments.length > 0 ? (
          departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => onSelectDepartment(dept)}
              className="p-4 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
            >
              {dept.name}
            </button>
          ))
        ) : (
          <p>No departments found.</p>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;

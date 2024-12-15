import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you're using supabase

const MinistryList = ({ onSelectMinistry }) => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAccessLevels, setUserAccessLevels] = useState([]);
  const employeeId = localStorage.getItem("employee_id"); // Assuming the employee_id is stored in local storage
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // State to track super_admin role

  useEffect(() => {
    const checkIfSuperAdmin = async () => {
      const { data, error } = await supabase
        .from("access_level")
        .select("access_id")
        .eq("employee_id", employeeId);

      if (error) {
        console.error("Error checking super admin", error);
        return;
      }

      const superAdminAccess = data.some((level) => level.access_id === 3); // Assuming '3' is the access level for super_admin
      setIsSuperAdmin(superAdminAccess);
    };

    checkIfSuperAdmin();
  }, [employeeId]);

  useEffect(() => {
    const fetchUserAccessLevels = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("access_level")
        .select("ministry_id")
        .eq("employee_id", employeeId);

      if (error) {
        console.error("Error fetching access levels", error);
        setLoading(false);
        return;
      }
      setUserAccessLevels(data);
    };

    if (!isSuperAdmin) {
      fetchUserAccessLevels();
    } else {
      setLoading(false);
    }
  }, [employeeId, isSuperAdmin]);

  useEffect(() => {
    const fetchMinistries = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("ministries").select("*");

      if (error) {
        console.error("Error fetching ministries", error);
        setLoading(false);
        return;
      }

      let filteredMinistries = data;

      // If not super admin, filter ministries based on the user's access level
      if (!isSuperAdmin) {
        filteredMinistries = data.filter((ministry) =>
          userAccessLevels.some(
            (accessLevel) => accessLevel.ministry_id === ministry.id
          )
        );
      }

      setMinistries(filteredMinistries);
      setLoading(false);
    };

    fetchMinistries();
  }, [userAccessLevels, isSuperAdmin]);

  if (loading) return <p>Loading ministries...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select a Ministry</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ministries.map((ministry) => (
          <button
            key={ministry.id}
            onClick={() => onSelectMinistry(ministry)} // Calling the onSelectMinistry function passed from the parent
            className="p-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
          >
            {ministry.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MinistryList;

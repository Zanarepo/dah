import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you're using Supabase

function ViewProfiles() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Fetch all profiles from Supabase or your database
    async function fetchProfiles() {
      const { data, error } = await supabase.from("employee_registration").select("*");
      if (error) {
        console.error(error);
      } else {
        setProfiles(data);
      }
    }

    fetchProfiles();
  }, []);

  return (
    <div className="view-profiles">
      <h2>All Employee Profiles</h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            {/* Add other columns as needed */}
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.employee_id}>
              <td>{profile.employee_id}</td>
              <td>{profile.first_name}</td>
              <td>{profile.last_name}</td>
              <td>{profile.email}</td>
              <td>{profile.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewProfiles;

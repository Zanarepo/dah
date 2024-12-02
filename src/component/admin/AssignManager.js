import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import "./assign.css";

const AssignManagerToDepartments = () => {
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState({});
  const [error, setError] = useState(null);

  // Fetch the list of managers and their details
  useEffect(() => {
    const fetchManagers = async () => {
      const { data, error } = await supabase
        .from('managers')
        .select(`
          id,
          employee_id,
          department_id,
          ministry_id,
          employee_profiles(first_name, last_name, email, phone_number)
        `);

      if (error) {
        setError(error.message);
        return;
      }

      setManagers(data);
    };

    // Fetch the list of departments, including the ministry_id, manager_id, and name
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, manager_id, ministry_id'); // Ensure name and manager_id are included

      if (error) {
        setError(error.message);
        return;
      }

      setDepartments(data);
    };

    fetchManagers();
    fetchDepartments();
  }, []);

  // Handle the change in department selection
  const handleDepartmentChange = (managerId, departmentId, isChecked) => {
    setSelectedDepartments((prevSelected) => {
      const updatedSelection = { ...prevSelected };
      if (isChecked) {
        if (!updatedSelection[managerId]) updatedSelection[managerId] = [];
        updatedSelection[managerId].push(departmentId);
      } else {
        updatedSelection[managerId] = updatedSelection[managerId].filter(
          (id) => id !== departmentId
        );
      }
      return updatedSelection;
    });
  };

  // Handle the submit to update the departments for the selected manager
  const handleSubmit = async (managerId) => {
    const departmentsToAssign = selectedDepartments[managerId];

    if (!departmentsToAssign || departmentsToAssign.length === 0) {
      alert("Please select at least one department for the manager.");
      return;
    }

    try {
      // Prepare the departments with their corresponding ministry_id, manager_id, and name
      const departmentsWithMinistry = departments.filter(department =>
        departmentsToAssign.includes(department.id)
      );

      const updatedDepartments = departmentsWithMinistry.map(department => ({
        id: department.id,
        name: department.name, // Ensure name is included
        manager_id: managerId,
        ministry_id: department.ministry_id // Ensure ministry_id is included
      }));

      // Update the department manager_id, ministry_id, and name
      const { error } = await supabase
        .from('departments')
        .upsert(updatedDepartments, { onConflict: ['id'] });

      if (error) {
        setError(error.message);
        return;
      }

      alert("Manager has been successfully assigned to departments.");
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Assign Managers to Departments</h2>

      {managers.length === 0 || departments.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <div>
          {managers.map((manager) => (
            <div key={manager.id} style={{ marginBottom: '20px' }}>
              <h3>{manager.employee_profiles.first_name} {manager.employee_profiles.last_name}</h3>
              <p>Email: {manager.employee_profiles.email}</p>
              <p>Phone: {manager.employee_profiles.phone_number}</p>

              <div>
                <h4>Select Departments:</h4>
                {departments.map((department) => (
                  <div key={department.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={department.id}
                        checked={selectedDepartments[manager.id]?.includes(department.id)}
                        onChange={(e) =>
                          handleDepartmentChange(manager.id, department.id, e.target.checked)
                        }
                      />
                      {department.name}
                    </label>
                  </div>
                ))}
              </div>

              <button onClick={() => handleSubmit(manager.id)}>Assign Manager to Departments</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignManagerToDepartments;

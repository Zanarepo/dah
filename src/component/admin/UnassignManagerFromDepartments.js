import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./assign.css";
import "./Notification.css";

const UnassignManagerFromDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [notification, setNotification] = useState(null); // Notification state
  const [error, setError] = useState(null);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data: departmentData, error: departmentError } = await supabase
          .from("departments")
          .select("id, name, manager_id, ministry_id");

        if (departmentError) throw new Error(departmentError.message);

        setDepartments(departmentData);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    };

    fetchDepartments();
  }, []);

  // Handle notifications
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  // Handle unassignment logic
  const handleUnassign = async () => {
    const departmentToUpdate = departments.find(
      (department) => department.id === selectedDepartment
    );

    if (!departmentToUpdate) {
      showNotification("Invalid department selection.", "error");
      return;
    }

    if (!departmentToUpdate.manager_id) {
      showNotification("This department has no assigned manager.", "info");
      return;
    }

    try {
      const updatedDepartment = {
        ...departmentToUpdate,
        manager_id: null, // Remove the manager
      };

      const { error } = await supabase
        .from("departments")
        .upsert(updatedDepartment, { onConflict: ["id"] });

      if (error) throw new Error(error.message);

      showNotification("Manager successfully unassigned from the department.", "success");
      setSelectedDepartment(null); // Reset selection
    } catch (unassignError) {
      showNotification(unassignError.message, "error");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Unassign Manager from a Department</h2>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {departments.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="dropdown">
            <label htmlFor="department-select">Select Department:</label>
            <select
              id="department-select"
              value={selectedDepartment || ""}
              onChange={(e) => setSelectedDepartment(Number(e.target.value))}
            >
              <option value="" disabled>
                -- Select a Department --
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleUnassign} style={{ marginTop: "20px" }}>
            Unassign Manager from Department
          </button>
        </div>
      )}
    </div>
  );
};

export default UnassignManagerFromDepartments;

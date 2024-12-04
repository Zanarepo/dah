import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./assign.css";
import "./Notification.css"

const AssignManagerToDepartments = () => {
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [notification, setNotification] = useState(null); // Notification state
  const [confirmationModal, setConfirmationModal] = useState(false); // Modal state
  const [departmentToReplace, setDepartmentToReplace] = useState(null); // Track department being updated
  const [error, setError] = useState(null);

  // Fetch managers and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: managerData, error: managerError } = await supabase
          .from("managers")
          .select(`
            id,
            employee_id,
            employee_profiles:employee_id (first_name, last_name)
          `);

        if (managerError) throw new Error(managerError.message);

        const { data: departmentData, error: departmentError } = await supabase
          .from("departments")
          .select("id, name, manager_id, ministry_id");

        if (departmentError) throw new Error(departmentError.message);

        setManagers(managerData);
        setDepartments(departmentData);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    };

    fetchData();
  }, []);

  // Helper to find manager details by ID
  const findManagerDetails = (managerId) => {
    const manager = managers.find((mgr) => mgr.id === managerId);
    if (manager) {
      const { first_name, last_name } = manager.employee_profiles || {};
      return `${first_name} ${last_name}`;
    }
    return "Unknown Manager";
  };

  // Handle notifications
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  // Handle manager assignment logic
  const handleAssign = async (confirmed = false) => {
    const departmentToUpdate = departments.find(
      (department) => department.id === selectedDepartment
    );

    if (!departmentToUpdate) {
      showNotification("Invalid department selection.", "error");
      return;
    }

    // Check if there's an existing manager
    if (
      departmentToUpdate.manager_id &&
      departmentToUpdate.manager_id !== selectedManager &&
      !confirmed
    ) {
      setDepartmentToReplace(departmentToUpdate);
      setConfirmationModal(true); // Show confirmation modal
      return;
    }

    try {
      const updatedDepartment = {
        ...departmentToUpdate,
        manager_id: selectedManager,
      };

      const { error } = await supabase
        .from("departments")
        .upsert(updatedDepartment, { onConflict: ["id"] });

      if (error) throw new Error(error.message);

      showNotification("Manager successfully assigned to the department.", "success");
      // Reset selection
      setSelectedManager(null);
      setSelectedDepartment(null);
      setConfirmationModal(false); // Close modal if open
    } catch (assignError) {
      showNotification(assignError.message, "error");
    }
  };

  // Confirm replacement of existing manager
  const confirmReplacement = () => {
    handleAssign(true);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Assign Manager to a Department</h2>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && departmentToReplace && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Manager Replacement</h3>
            <p>
              This department already has a manager:{" "}
              {findManagerDetails(departmentToReplace.manager_id)}. Do you want
              to replace them?
            </p>
            <div className="modal-actions">
              <button onClick={confirmReplacement} className="confirm-button">
                Yes
              </button>
              <button
                onClick={() => setConfirmationModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {managers.length === 0 || departments.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="dropdown">
            <label htmlFor="manager-select">Select Manager:</label>
            <select
              id="manager-select"
              value={selectedManager || ""}
              onChange={(e) => setSelectedManager(Number(e.target.value))}
            >
              <option value="" disabled>
                -- Select a Manager --
              </option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.employee_profiles.first_name}{" "}
                  {manager.employee_profiles.last_name}
                </option>
              ))}
            </select>
          </div>

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

          <button onClick={() => handleAssign()} style={{ marginTop: "20px" }}>
            Assign Manager to Department
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignManagerToDepartments;

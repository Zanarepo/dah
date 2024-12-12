import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MinistryList from "../MinistryDashboard/MinistryList";
import DepartmentList from "../MinistryDashboard/DepartmentList";
import DepartmentLeaveDashboard from "./DepartmentLeaveDashboard";

const MinistryLeave = () => {
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded-md">
      {/* Back Navigation */}
      {(selectedDepartment || selectedMinistry) && (
        <button
          onClick={() => {
            if (selectedDepartment) {
              setSelectedDepartment(null); // Back to department view
            } else if (selectedMinistry) {
              setSelectedMinistry(null); // Back to ministry view
            }
          }}
          className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          &larr; Back
        </button>
      )}

      {/* Additional Back Button for Ministry Page */}
      {!selectedMinistry && (
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          &larr; Back
        </button>
      )}

      {/* Ministry List */}
      {!selectedMinistry && (
        <MinistryList onSelectMinistry={(ministry) => setSelectedMinistry(ministry)} />
      )}

      {/* Department List */}
      {selectedMinistry && !selectedDepartment && (
        <DepartmentList
          ministry={selectedMinistry}
          onSelectDepartment={(department) => setSelectedDepartment(department)}
        />
      )}

      {/* Department Dashboard */}
      {selectedDepartment && (
        <DepartmentLeaveDashboard department={selectedDepartment} />
      )}
    </div>
  );
};

export default MinistryLeave;

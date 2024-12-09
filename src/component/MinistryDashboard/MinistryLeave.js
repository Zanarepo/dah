import React, { useState, useEffect } from "react";
import MinistryList from "./MinistryList";
import DepartmentList from "./DepartmentList";
import DepartmentDashboard from "./DepartmentDashboard";

const MinistryLeave = () => {
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  return (
    
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded-md">
      {/* Back Navigation */}
      {(selectedDepartment || selectedMinistry) && (
        <button
          onClick={() => {
            if (selectedDepartment) {
              setSelectedDepartment(null); // Back to department view
            } else {
              setSelectedMinistry(null); // Back to ministry view
            }
          }}
          className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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
        <DepartmentDashboard department={selectedDepartment} />
      )}
    </div>
  );
};

export default MinistryLeave;

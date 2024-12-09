import React from "react";
import { useNavigate } from "react-router-dom";


const DepartmentDashboard = ({ department }) => {
  const navigate = useNavigate();

  const dashboards = [
    { name: "Leave Requests", route: `/minleave-requests/${department.id}` },
    { name: "Leave Tracker", route: `/minleave-tracker/${department.id}` },
    { name: "Leave Approval", route: `/minleave-approval/${department.id}` },
    { name: "Leave History", route: `/minleave-history/${department.id}` },
  
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Dashboards for {department.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dashboards.map((dash) => (
          <button
            key={dash.route}
            onClick={() => navigate(dash.route)}
            className="p-4 bg-purple-500 text-white rounded-md shadow hover:bg-purple-600"
          >
            {dash.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentDashboard;

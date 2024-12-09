import React from "react";
import { Link } from "react-router-dom";

const DepartmentDashboard = () => {
  const dashboardItems = [
    {
      name: "Employee Portals",
      icon: "👥", // Icon representation
      route: "/GeneralEmployeePortal",
    },
    {
      name: "Leave Portals",
      icon: "📝",
      route: "/GeneralLeaveCentre",
    },
    {
      name: "Retirements",
      icon: "🎂",
      route: "/GeneralRetirees",
    },
    {
      name: "Performance",
      icon: "📈",
      route: "/performance",
    },
    {
      name: "Attendance",
      icon: "⏰",
      route: "/attendance",
    },
    {
      name: "Verification",
      icon: "✅",
      route: "/verification",
    },
    {
      name: "Recruitment",
      icon: "💼",
      route: "/recruitment",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 mt-16 mb-4 text-center">
        Department Dashboard
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        Explore and manage department-specific tools and services.
      </p>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {dashboardItems.map((item, index) => (
          <Link
            key={index}
            to={item.route}
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1 w-full"
          >
            <div className="text-green-500 text-4xl mb-4">{item.icon}</div>
            <h2 className="text-lg font-semibold text-gray-700">{item.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DepartmentDashboard;

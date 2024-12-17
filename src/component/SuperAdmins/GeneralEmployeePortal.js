import React from "react";
import { Link } from "react-router-dom";
//import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";  // Notification Component

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";





const EmployeePortal = () => {
const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100 relative">
      {/* Notification Component */}
      <div className="absolute top-4 right-4">
        {/* <AdminLeaveNotification /> */}

      </div>

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 mt-16 mb-4 text-center">
        General Employees Portal
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        Access employee data, view the employee list, and check the on-vacation status.
      </p>

      <button
  className="absolute top-4 left-4 flex items-center text-blue-500 hover:text-blue-700"
  onClick={() => navigate(-1)}
>
  <FaArrowLeft className="mr-2" /> Back
</button>
      {/* Buttons Row */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        <Link
          to="/GeneralEmployeesSearch"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-blue-500 text-4xl mb-4">👥</div>
          <h2 className="text-lg font-semibold text-gray-700">General Employees</h2>
        </Link>

        <Link
          to="/GeneralEmployeeTable"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-blue-500 text-4xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-gray-700">General Employees Table </h2>
        </Link>

        <Link
          to="/GeneralVacation"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-blue-500 text-4xl mb-4">🌴</div>
          <h2 className="text-lg font-semibold text-gray-700">General Vacations</h2>
        </Link>
      </div>
    </div>
  );
};

export default EmployeePortal;

import React from "react";
import { Link } from "react-router-dom";
import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";
import {  FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const LeaveCentre = () => {

const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100 relative">
      {/* Notification Component */}
      <div className="absolute top-4 right-4">
        <AdminLeaveNotification />
      </div>
      <button
  className="absolute top-4 left-4 flex items-center text-blue-500 hover:text-blue-700"
  onClick={() => navigate(-1)}
>
  <FaArrowLeft className="mr-2" /> Back
</button>

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 mt-16 mb-4 text-center">
        Leave Centre
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        Manage approvals, track leave status, view history, and make requests all in one place.
      </p>

      {/* Buttons Row */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        {/* Leave Approval */}
        <Link
          to="/GeneralLeaveApproval"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-green-500 text-4xl mb-4">📝</div>
          <h2 className="text-lg font-semibold text-gray-700">Leave Approval</h2>
        </Link>

        {/* Leave Status Display */}
        <Link
          to="/GeneralLeaveStatus"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-green-500 text-4xl mb-4">📊</div>
          <h2 className="text-lg font-semibold text-gray-700">Leave Status Display</h2>
        </Link>

        {/* Leave History */}
        <Link
          to="/GeneralLeaveHistory"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-green-500 text-4xl mb-4">📜</div>
          <h2 className="text-lg font-semibold text-gray-700">Leave History</h2>
        </Link>

        {/* Leave Request */}
        <Link
          to="/GeneralLeaveRequests"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-green-500 text-4xl mb-4">📬</div>
          <h2 className="text-lg font-semibold text-gray-700">Leave Request</h2>
        </Link>
      </div>
    </div>
  );
};

export default LeaveCentre;

import React from "react";
import { Link } from "react-router-dom";
import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";

const LeaveCentre = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100 relative">
      {/* Notification Component */}
      <div className="absolute top-4 right-4">
        <AdminLeaveNotification />
      </div>

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 mt-16 mb-4 text-center">
        Leave Centre
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        Manage approvals, track leave status, and view history all in one place.
      </p>

      {/* Buttons Row */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        <Link
          to="/leave-approval"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-green-500 text-4xl mb-4">📝</div>
          <h2 className="text-lg font-semibold text-gray-700">Leave Approval</h2>
        </Link>

        <Link
          to="/tracks"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-green-500 text-4xl mb-4">📊</div>
          <h2 className="text-lg font-semibold text-gray-700">
            Leave Status Display
          </h2>
        </Link>

        <Link
          to="/leave-status"
          className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition w-64"
        >
          <div className="text-green-500 text-4xl mb-4">📜</div>
          <h2 className="text-lg font-semibold text-gray-700">Leave History</h2>
        </Link>
      </div>
    </div>
  );
};

export default LeaveCentre;

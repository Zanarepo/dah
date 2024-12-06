import React from "react";
import { Link } from "react-router-dom";
import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";
import "./AdminPage.css"; // Add any custom styles here

const AdminPage = () => {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        {/* Link to Leave Approval */}
        <button className="admin-tab-button">
          <Link to="/leave-centre">Leave Centre</Link>
        </button>

        {/* Notification Icon */}
          <AdminLeaveNotification />
        
      </div>
    </div>
  );
};

export default AdminPage;

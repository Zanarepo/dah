import React from 'react';
import { Link } from 'react-router-dom';
// Import LeaveApproval Component
import NotificationIcon from './NotificationIcon'; // Import Notifications Component
import './AdminPage.css'; // You can add custom styles here

const AdminPage = () => {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button className="admin-tab-button">
          <Link to="/leave-centre">Leave Centre</Link>
        </button>
        
        {/* Render NotificationIcon as a component */}
        <NotificationIcon />

      </div>

    </div>
  );
};

export default AdminPage;

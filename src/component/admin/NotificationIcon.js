import React from 'react';
import { FaBell } from "react-icons/fa";
import { Link } from 'react-router-dom';

const NotificationIcon = ({ unreadCount }) => {
  return (
    <div className="notification-icon-container">
      <Link to="/notifications">
        <FaBell className="notification-icon" />
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      </Link>
    </div>
  );
};

export default NotificationIcon;

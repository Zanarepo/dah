import React from 'react';
import { Link } from 'react-router-dom';
import './LeaveCentre.css'; // You can add your custom styles here

const LeaveCentre = () => {
  return (
    <div className="leave-centre">
      <h1>Leave Centre</h1>

      <div className="leave-centre-tabs">
        {/* Navigation links for leave-related pages */}
        <button className="leave-centre-tab-button">
          <Link to="/leave-approval">Leave Approval</Link>
        </button>

        <button className="leave-centre-tab-button">
          <Link to="/leave-status">Leave Status Tracker</Link>
        </button>

        {/* Add more leave-related pages as you need */}
      </div>

      {/* Add outlet for nested routes */}
      {/* This will render the component based on the selected route */}
    </div>
  );
};

export default LeaveCentre;

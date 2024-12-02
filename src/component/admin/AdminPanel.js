import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import LeaveRequestDashboard from "./LeaveRetirementDashboard.js"; // Importing the dashboard
import Settings from "./Settings"; // Import the Settings component
import "./AdminPanel.css";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("viewProfiles");

  return (
    <div className="admin-dashboard">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Navigation Tabs */}
      <div className="tabs flex gap-4 mb-4">
        <Link
          to="/personal-details"
          className={`tab ${activeTab === "personalDetails" ? "active" : ""}`}
          onClick={() => setActiveTab("personalDetails")}
        >
          Personal Details
        </Link>
        <Link
          to="/employment-details"
          className={`tab ${activeTab === "employmentDetails" ? "active" : ""}`}
          onClick={() => setActiveTab("employmentDetails")}
        >
          Employment Details
        </Link>
        <Link
          to="/leave-retirement-details"
          className={`tab ${activeTab === "leaveDetails" ? "active" : ""}`}
          onClick={() => setActiveTab("leaveDetails")}
        >
          Leave & Retirement
        </Link>
        <Link
          to="/leave-approval"
          className={`tab ${activeTab === "LeaveApproval" ? "active" : ""}`}
          onClick={() => setActiveTab("LeaveApproval")}
        >
          Leave Requests
        </Link>
        <Link
          to="/register"
          className={`tab ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Register Employee
        </Link>
        <Link
          to="/login"
          className={`tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </Link>
        <Link
          to="/settings"
          className={`tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </Link>
      </div>

      {/* Routes */}
      <div className="content">
        <Routes>
          {/* Other routes */}
          <Route path="/leave-requests" element={<LeaveRequestDashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminPanel;

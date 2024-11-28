import React from "react";
import { Link } from "react-router-dom";  // For navigation
import { useState } from "react";

// Importing other components
import ViewProfiles from "./ViewProfiles"; // A component to view all profiles
import EmployeeForm from "./EmployeeForm"; // A component for creating new profiles
import LoginForm from "../auth/LoginForm"; // A component for login form

function Admin() {
  const [activeTab, setActiveTab] = useState("viewProfiles");  // State to track active tab

  return (
    <div className="admin-dashboard">
      <div className="tabs">
        {/* Tabs navigation */}
        <button
          className={`tab ${activeTab === "viewProfiles" ? "active" : ""}`}
          onClick={() => setActiveTab("viewProfiles")}
        >
          View Profiles
        </button>
        <button
          className={`tab ${activeTab === "createProfile" ? "active" : ""}`}
          onClick={() => setActiveTab("createProfile")}
        >
          Create Profile
        </button>
        <button
          className={`tab ${activeTab === "loginForm" ? "active" : ""}`}
          onClick={() => setActiveTab("loginForm")}
        >
          Login Form
        </button>
      </div>

      <div className="tab-content">
        {/* Render content based on active tab */}
        {activeTab === "viewProfiles" && <ViewProfiles />}
        {activeTab === "employeeForm" && <EmployeeForm />}
        {activeTab === "loginForm" && <LoginForm />}
      </div>
    </div>
  );
}

export default Admin;

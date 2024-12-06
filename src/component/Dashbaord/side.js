import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  UserGroupIcon,
  ClipboardListIcon,
  TrendingUpIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  CakeIcon,
  CogIcon,
} from "@heroicons/react/outline";
import "./Sidebar.css"; // Link to the CSS file

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Track if sidebar is open or closed

  const menuItems = [
    { name: "Employees", icon: <UserGroupIcon style={{ width: "24px", height: "24px" }} />, route: "/employees" },
    { name: "Leave Dashboard", icon: <ClipboardListIcon style={{ width: "24px", height: "24px" }} />, route: "/leave-centre" },
    { name: "Promotions", icon: <TrendingUpIcon style={{ width: "24px", height: "24px" }} />, route: "/promotions" },
    { name: "Attendance", icon: <ClockIcon style={{ width: "24px", height: "24px" }} />, route: "/attendance" },
    { name: "Performance", icon: <ChartBarIcon style={{ width: "24px", height: "24px" }} />, route: "/performance" },
    { name: "Verification Exercise", icon: <CheckCircleIcon style={{ width: "24px", height: "24px" }} />, route: "/verification" },
    { name: "Recruitment", icon: <BriefcaseIcon style={{ width: "24px", height: "24px" }} />, route: "/recruitment" },
    { name: "Retirement", icon: <CakeIcon style={{ width: "24px", height: "24px" }} />, route: "/retirement" },
    { name: "Settings", icon: <CogIcon style={{ width: "24px", height: "24px" }} />, route: "/settings" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen); // Function to toggle sidebar

  return (
    <div className="sidebar-container">
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? "Close" : "Open"} Sidebar
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <ul className="sidebar-list">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar-item">
              <NavLink
                to={item.route}
                className="sidebar-link"
                activeClassName="active"
                onClick={() => setIsOpen(false)} // Close sidebar when a link is clicked on mobile
              >
                <div className="sidebar-icon">{item.icon}</div>
                <span className={`sidebar-text ${isOpen ? "show" : "hide"}`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className={`content ${isOpen ? "with-sidebar" : "no-sidebar"}`}>
        <div>
          {/* Your page content */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

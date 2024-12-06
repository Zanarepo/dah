import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const SuperAdmin = () => {
  return (
    <div className="superadmin-container flex">
      {/* Sidebar */}
      <nav className="w-1/4 bg-gray-800 text-white p-4">
        <h2>SuperAdmin Panel</h2>
        <ul>
          <li>
            <Link to="/g-departments">Departments</Link>
          </li>
          <li>
            <Link to="/g-ministries">Ministries</Link>
          </li>
          <li>
            <Link to="/g-admins">Admins</Link>
          </li>
          <li>
            <Link to="/g-dashboards">Dashboards</Link>
          </li>
          <li>
            <Link to="/g-settings">Settings</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="w-3/4 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default SuperAdmin;

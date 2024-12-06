import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";
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
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Track if sidebar is open or closed

  const menuItems = [
    { name: "Employees", icon: <UserGroupIcon className="h-6 w-6" />, route: "/employee-portals" },
    { name: "Leave Dashboard", icon: <ClipboardListIcon className="h-6 w-6" />, route: "/leave-centre" },
    { name: "Promotions", icon: <TrendingUpIcon className="h-6 w-6" />, route: "/promotions" },
    { name: "Attendance", icon: <ClockIcon className="h-6 w-6" />, route: "/attendance" },
    { name: "Performance", icon: <ChartBarIcon className="h-6 w-6" />, route: "/performance" },
    { name: "Verification Exercise", icon: <CheckCircleIcon className="h-6 w-6" />, route: "/verification" },
    { name: "Recruitment", icon: <BriefcaseIcon className="h-6 w-6" />, route: "/recruitment" },
    { name: "Retirement", icon: <CakeIcon className="h-6 w-6" />, route: "/retirement" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, route: "/settings" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen); // Function to toggle sidebar

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-red rounded-md md:hidden"
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:w-64 w-64`}
      >
        {/* Sidebar Content */}
        <div className="flex items-center justify-between p-4">
  <h4 className="text-xl font-bold">Menu</h4>
  <div className="p-2">
    <AdminLeaveNotification />
  </div>
</div>


        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="hover:bg-blue-700">
              <NavLink
                to={item.route}
                className="flex items-center p-4 space-x-2"
                activeClassName="bg-blue-600"
                onClick={() => setIsOpen(false)} // Close sidebar when a link is clicked on mobile
              >
                {item.icon}
                {/* Only show the text when the sidebar is open or on desktop */}
                <span className={`${isOpen ? "block" : "hidden"} md:block`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

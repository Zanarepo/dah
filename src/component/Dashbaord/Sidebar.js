import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon, // Replaced ClipboardListIcon
  ArrowTrendingUpIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  CakeIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Track if sidebar is open or closed
  const sidebarRef = useRef(null); // Reference to the sidebar

  const menuItems = [
    { name: "Employees", icon: <UserGroupIcon className="h-6 w-6" />, route: "/employee-portals" },
    { name: "Leave Dashboard", icon: <ClipboardDocumentListIcon className="h-6 w-6" />, route: "/leave-centre" },
    { name: "Promotions", icon: <ArrowTrendingUpIcon className="h-6 w-6" />, route: "/promotions" },
    { name: "Attendance", icon: <ClockIcon className="h-6 w-6" />, route: "/attendance" },
    { name: "Performance", icon: <ChartBarIcon className="h-6 w-6" />, route: "/performance" },
    { name: "Verification Exercise", icon: <CheckCircleIcon className="h-6 w-6" />, route: "/verification" },
    { name: "Recruitment", icon: <BriefcaseIcon className="h-6 w-6" />, route: "/recruitment" },
    { name: "Retirement", icon: <CakeIcon className="h-6 w-6" />, route: "/retirement" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, route: "/settings" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen); // Function to toggle sidebar

  // Close sidebar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); // Close sidebar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef} // Attach ref to sidebar
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0 z-50" : "-translate-x-full z-30"
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

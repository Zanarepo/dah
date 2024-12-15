import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";
import {

  BuildingLibraryIcon,
  UsersIcon,
  ChartPieIcon,
  CogIcon,
  BellIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon,
  ChatBubbleLeftIcon
} from "@heroicons/react/24/outline";

const SuperAdmin = () => {
  const [isOpen, setIsOpen] = useState(false); // Track sidebar state
  const sidebarRef = useRef(null); // Reference to the sidebar

  const menuItems = [
    { name: "Notifications", icon: <BellIcon className="h-6 w-6" />, route: "/general-notification" },
    //{ name: "Departments", icon: <BuildingOffice2Icon className="h-6 w-6" />, route: "/adminministry" },
    { name: "Ministries", icon: <BuildingLibraryIcon className="h-6 w-6" />, route: "/activities" },
    { name: "Admins", icon: <UsersIcon className="h-6 w-6" />, route: "/ministryadmins" },
    { name: "Dashboards", icon: <ChartPieIcon className="h-6 w-6" />, route: "/g-dashboards" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, route: "/super-settings" },
    { name: "Chat", icon: <ChatBubbleLeftIcon className="h-6 w-6" />, route: "/buzz" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen); // Toggle sidebar visibility

  // Close sidebar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef} // Attach ref to sidebar
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0 z-50" : "-translate-x-full z-30"
        } transition-transform md:translate-x-0 md:w-64 w-64`}
      >
        <div className="flex items-center justify-between p-4">
          <h4 className="text-xl font-bold">Ministry Admin</h4>

          <div className="flex items-center justify-between p-4">
        
          <div className="p-2">
            <AdminLeaveNotification />
          </div>
        </div>
          {/* Close button for mobile */}
          <button onClick={toggleSidebar} className="md:hidden">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="hover:bg-blue-700">
              <NavLink
                to={item.route}
                className="flex items-center p-4 space-x-2"
                activeClassName="bg-blue-600"
                onClick={() => setIsOpen(false)} // Close sidebar on mobile after navigation
              >
                {item.icon}
                <span className={`${isOpen ? "block" : "hidden"} md:block`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default SuperAdmin;

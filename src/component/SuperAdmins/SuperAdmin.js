import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BuildingOffice2Icon,
  BuildingLibraryIcon,
  UsersIcon,
  ChartPieIcon,
  CogIcon,
  BellIcon, // Replaced BellAlertIcon with BellIcon
  Bars3Icon as MenuIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // Updated import path to v2

const SuperAdmin = () => {
  const [isOpen, setIsOpen] = useState(false); // Track sidebar state

  const menuItems = [
    { name: "Notifications", icon: <BellIcon className="h-6 w-6" />, route: "/g-notifications" }, // Replaced BellAlertIcon with BellIcon
    { name: "Departments", icon: <BuildingOffice2Icon className="h-6 w-6" />, route: "/g-departments" },
    { name: "Ministries", icon: <BuildingLibraryIcon className="h-6 w-6" />, route: "/g-ministries" },
    { name: "Admins", icon: <UsersIcon className="h-6 w-6" />, route: "/g-admins" },
    { name: "Dashboards", icon: <ChartPieIcon className="h-6 w-6" />, route: "/g-dashboards" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, route: "/g-settings" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen); // Toggle sidebar visibility
  

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:w-64 w-64`}
      >
        <div className="flex items-center justify-between p-4">
          <h4 className="text-xl font-bold">SuperAdmin</h4>
          {/* Close button for mobile */}
          <button onClick={toggleSidebar} className="md:hidden">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className="mt-4">
          {menuItems.map((item, index) => (
            <li key={index} className="hover:bg-blue-700">
              <NavLink
                to={item.route}
                className="flex items-center p-4 space-x-2"
                activeClassName="bg-blue-600"
                onClick={() => setIsOpen(false)} // Close sidebar on mobile after navigation
              >
                {item.icon}
               {/*   <span className="hidden md:block">{item.name}</span>
                 hide sidebar elements */}

                      {/* show sidebar elements */}
                <span className={`${isOpen ? "block" : "hidden"} md:block`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-6 bg-gray-100"> {/* Content section that takes the remaining width */}
        <Outlet />
      </div>
    </>
  );
};

export default SuperAdmin;

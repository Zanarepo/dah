import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
//import AdminLeaveNotification from "../Notifications/AdminLeaveNotification";
import { FiLogOut } from "react-icons/fi"; // Tasks icon for TodoList
import {
  BuildingLibraryIcon,
  ChartPieIcon,
  CogIcon,
  BellIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  ViewColumnsIcon,
  UserGroupIcon,
  CheckCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const Admin = () => {
  const [isOpen, setIsOpen] = useState(false); // Track sidebar state
  const sidebarRef = useRef(null); // Reference to the sidebar

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="h-6 w-6" />, route: "/" },
    { name: "Notifications", icon: <BellIcon className="h-6 w-6" />, route: "/admin-notification" },
    { name: "Ministry", icon: <BuildingLibraryIcon className="h-6 w-6" />, route: "/departactvities" },
    { name: "Dashboards", icon: <ChartPieIcon className="h-6 w-6" />, route: "/admin-dashboard" },
    { name: "BuzzMe", icon: <ChatBubbleLeftIcon className="h-6 w-6" />, route: "/chatest" },
    { name: "Task Board", icon: <ViewColumnsIcon className="h-6 w-6" />, route: "/admintaskboard" },
    { name: "Employees", icon: <UserGroupIcon className="h-6 w-6" />, route: "/adminlists" },
    { name: "Attendance", icon: <CheckCircleIcon className="h-6 w-6" />, route: "/dept-attendance" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, route: "/admin-settings" },
    { name: "Logout", icon: <FiLogOut className="h-6 w-6" />, route: "/signout" },
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
        } transition-transform md:translate-x-0 md:w-52 w-52`} // Reduced sidebar width
      >
        <div className="flex items-center justify-between p-4">
          <h4 className="text-xl font-bold">Admin Dashboard</h4>
          <button onClick={toggleSidebar} className="md:hidden">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
  {/* Sidebar 
        <div className="p-2">
          <AdminLeaveNotification />
        </div>
*/}
        <ul className="space-y-1"> {/* Reduced space between items */}
          {menuItems.map((item, index) => (
            <li key={index} className="hover:bg-blue-700">
              <NavLink
                to={item.route}
                className="flex items-center p-2 space-x-2" // Reduced padding
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
      <div className="flex-1 md:ml-52 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;

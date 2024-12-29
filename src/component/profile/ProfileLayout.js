import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { NavLink, Route, Routes } from "react-router-dom";
import EmployeePersonalDetails from "./EmployeePersonalDetails";
import EmployeeEmploymentDetails from "./EmployeeEmploymentDetails";
import Leave from "./Leave";
import Notifications from "../admin/Notification";
import EmployeeChatApp from "../Chat/EmployeeChatApp";
import QuickActionPopup from "../profile/QuickActionPopup";
import WelcomeUser from "./WelcomeUser";
import TaskDashboardTracker from "../Productivity/TaskDashboardTracker";
import EmployeeAttendance from "../Productivity/EmployeeAttendance";
import AttendanceDashboard from "../Productivity/AttendanceDashboard";
import Calendar from "react-calendar";
import AttendanceMessage from "../Productivity/AttendanceMessage";
import EmployeeIssueReport from "../Productivity/EmployeeIssueReport";
import Logout from "../auth/Logout";
import Notify from '../GeneralNotifications/Notify'
import { FaTasks } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi"; // Tasks icon for TodoList

import {
  BellIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  HomeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Attendance from "../Productivity/Attendance";

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar visibility
  const sidebarRef = useRef(null);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const employeeId = localStorage.getItem("employee_id");
      if (!employeeId) {
        console.error("Employee ID not found");
        return;
      }

      const { data, error } = await supabase
        .from("employee_profiles")
        .select("*")
        .eq("employee_id", employeeId)
        .single();

      if (error) {
        console.error("Error fetching employee data", error);
      } else {
        setEmployeeData(data);
      }
      setLoading(false);
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employeeData) {
    return <div>Error: Employee data not found.</div>;
  }

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="h-6 w-6" />, route: "/" },
    { name: "BuzzMe", icon: <ChatBubbleLeftIcon className="h-6 w-6" />, route: "/chatest" },
    { name: "Personal Details", icon: <UserIcon className="h-6 w-6" />, route: "/personal-details" },
    { name: "Employment Details", icon: <BriefcaseIcon className="h-6 w-6" />, route: "/employment-details" },
    { name: "Attendance Board", icon: <CheckCircleIcon className="h-6 w-6" />, route: "/attendance-board" },
    { name: "Leave", icon: <CalendarIcon className="h-6 w-6" />, route: "/leave" },
    { name: "Notifications", icon: <BellIcon className="h-6 w-6" />, route: "/profile-notifications" },
    { name: "Task Dashboard", icon: <FaTasks className="h-6 w-6" />, route: "/task-dashboard" },
    { name: "Issue Reports", icon: <ExclamationCircleIcon className="h-6 w-6" />, route: "/reports" },
    { name: "Logout", icon: <FiLogOut className="h-6 w-6" />, route: "/logout" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 bg-gray-800 text-white transition-transform w-48 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ height: "100vh" }}
      >
        <div className="flex items-center justify-between p-4">
          <h4 className="text-xl font-bold">Employee Dashboard</h4>
          <button onClick={toggleSidebar} className="md:hidden">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className="space-y-1"> {/* Reduced space between items */}
          {menuItems.map((item, index) => (
            <li key={index} className="hover:bg-blue-700">
              <NavLink
                to={item.route}
                className="flex items-center p-2 space-x-2" // Reduced padding here to 2
                activeClassName="bg-blue-600"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span> {/* Optional: Decrease font size */}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-4 transition-all duration-300 ${isOpen ? "ml-48" : "ml-0"} md:ml-48`} // Adjust content width accordingly
        style={{ overflowY: "auto" }}
      >
        {/* Welcome Message */}
        <WelcomeUser name={employeeData.first_name} />

        {/* Routes */}
        <Routes>
          <Route path="personal-details" element={<EmployeePersonalDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />} />
          <Route path="employment-details" element={<EmployeeEmploymentDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />} />
          <Route path="leave" element={<Leave employeeData={employeeData} />} />
          <Route path="profile-notifications" element={<Notifications employee_id={employeeData.employee_id} />} />
          <Route path="chatting" element={<EmployeeChatApp employee_id={employeeData.employee_id} />} />
          <Route path="checkin" element={<Attendance employee_id={employeeData.employee_id} />} />
          <Route path="employee-checkins" element={<EmployeeAttendance employee_id={employeeData.employee_id} />} />
          <Route path="attendance-board" element={<AttendanceDashboard employee_id={employeeData.employee_id} />} />
          <Route path="calendar" element={<Calendar employee_id={employeeData.employee_id} />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="greetings" element={<AttendanceMessage />} />
          <Route path="/notify" element={<Notify />} />
          <Route path="task-dashboard" element={<TaskDashboardTracker />} />
          <Route path="reports" element={<EmployeeIssueReport />} />
        </Routes>
      </div>

      {/* Notify Component with fixed padding issue */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0 }}>
        <QuickActionPopup />
      </div>
    </div>
  );
};

export default EmployeeDashboard;

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { NavLink, Route, Routes } from "react-router-dom";
import EmployeePersonalDetails from "./EmployeePersonalDetails";
import EmployeeEmploymentDetails from "./EmployeeEmploymentDetails";
import Leave from "./Leave";
import Notifications from "../admin/Notification";
//import ChatApp from "../Chat/ChatApp";
import EmployeeChatApp from "../Chat/EmployeeChatApp"
import {
  BellIcon,
  //BuildingLibraryIcon,
  UserIcon,
 // ChartPieIcon,
  ChatBubbleLeftIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon,
  BriefcaseIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar visibility
  const sidebarRef = useRef(null);
  //const navigate = useNavigate();

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
    { name: "Personal Details", icon: <UserIcon  className="h-6 w-6" />, route: "/personal-details" },
    { name: "Employment Details", icon: <BriefcaseIcon className="h-6 w-6" />, route: "/employment-details" },
    { name: "Leave", icon: < CalendarIcon  className="h-6 w-6" />, route: "/leave" },
    { name: "Notifications", icon: <BellIcon className="h-6 w-6" />, route: "/profile-notifications" },
    { name: "Chat", icon: <ChatBubbleLeftIcon className="h-6 w-6" />, route: "/chatapps" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen); // Toggle sidebar visibility

  return (
    <div className="flex min-h-screen">
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
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0 z-50" : "-translate-x-full z-30"
        } md:relative md:w-64 w-64 md:block`}
        style={{
          height: "100vh", // Ensures the sidebar takes up the entire height of the screen
        }}
      >
        <div className="flex items-center justify-between p-4">
          <h4 className="text-xl font-bold">Employee Dashboard</h4>
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
      <div
        className={`flex-1 p-4 transition-all duration-300 ${isOpen ? "ml-64" : "ml-0"} md:ml-0`}
        style={{
          marginLeft: isOpen ? "256px" : "0px", // Ensure content starts right after the sidebar
          height: "100vh", // Set the height of the main content to take full screen
          overflowY: "auto", // Allow the main content to scroll
        }}
      >
        <Routes>
          <Route
            path="/personal-details"
            element={<EmployeePersonalDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />}
          />
          <Route
            path="/employment-details"
            element={<EmployeeEmploymentDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />}
          />
          <Route path="/leave" element={<Leave employeeData={employeeData} />} />
          <Route
            path="/profile-notifications"
            element={<Notifications employee_id={employeeData.employee_id} />}
          />
          <Route
            path="/chatapps"
            element={<EmployeeChatApp employee_id={employeeData.employee_id} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

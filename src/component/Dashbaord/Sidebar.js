import React from "react";
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

const Sidebar = () => {
  const menuItems = [
    { name: "Employees", icon: <UserGroupIcon className="h-6 w-6" />, route: "/employees" },
    { name: "Leave Dashboard", icon: <ClipboardListIcon className="h-6 w-6" />, route: "/leave-approvals" },
    { name: "Promotions", icon: <TrendingUpIcon className="h-6 w-6" />, route: "/promotions" },
    { name: "Attendance", icon: <ClockIcon className="h-6 w-6" />, route: "/attendance" },
    { name: "Performance", icon: <ChartBarIcon className="h-6 w-6" />, route: "/performance" },
    { name: "Verification Exercise", icon: <CheckCircleIcon className="h-6 w-6" />, route: "/verification" },
    { name: "Recruitment", icon: <BriefcaseIcon className="h-6 w-6" />, route: "/recruitment" },
    { name: "Retirement", icon: <CakeIcon className="h-6 w-6" />, route: "/retirement" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, route: "/settings" },
  ];

  return (
    <div className="bg-gray-800 text-white h-full w-64 fixed flex flex-col">
      <h2 className="text-xl font-bold p-4">Menu</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} className="hover:bg-gray-700">
            <NavLink
              to={item.route}
              className="flex items-center p-4 space-x-2"
              activeClassName="bg-blue-600"
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

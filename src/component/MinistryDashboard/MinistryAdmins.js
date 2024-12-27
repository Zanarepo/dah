import React from "react";
import { Link } from "react-router-dom";


import {
  FaUserShield,
  FaUsersCog,
  FaBuilding,
 
  FaUserTie, // Icon for Assign Admin to Department & Ministry
} from "react-icons/fa";

const SettingsDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
     
      {/* Dashboard Buttons Grid  <h2 className="text-2xl font-bold mb-6 text-center">Settings Dashboard</h2>*/}
      <p className="text-gray-700 text-center mb-8">
        Manage roles, departments, ministries, and more from this dashboard. Click any option to proceed.
      </p>

      {/* Dashboard Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* SuperAdmin Role Dashboard */}
        <div className="flex justify-center">
          <Link to="/minrole-dashboard">
            <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center">
              <FaUserShield className="mr-2 text-xl" />
              <span>Manage Admin Roles</span>
            </button>
          </Link>
        </div>
        

        {/* Add Manager Dashboard */}
        <div className="flex justify-center">
          <Link to="/addmin-manager">
            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center justify-center">
              <FaUsersCog className="mr-2 text-xl" />
              <span>Add or Remove Managers</span>
            </button>
          </Link>
        </div>

        {/* Add Ministry Dashboard */}
        <div className="flex justify-center">
          <Link to="/adremove-minidashboard">
            <button className="w-full bg-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
              <FaBuilding className="mr-2 text-xl" />
              <span>Add or Remove Department</span>
            </button>
          </Link>
        </div>

        
     

        {/* Assign Admin to Department & Ministry */}
        <div className="flex justify-center">
          <Link to="/assignadmin-department">
            <button className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 flex items-center justify-center">
              <FaUserTie className="mr-2 text-xl" />
              <span>Assign Admin to Departments</span>
            </button>
          </Link>
        </div>

        {/* Add Department Dashboard */}
    </div>  
          
    </div>      
        
    
  );
};

export default SettingsDashboard;

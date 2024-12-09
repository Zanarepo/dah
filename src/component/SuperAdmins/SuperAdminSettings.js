import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield, FaUsersCog, FaBuilding, FaLayerGroup } from 'react-icons/fa'; // Icons for each section

const SettingsDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Settings Dashboard</h2>
      <p className="text-gray-700 text-center mb-8">
        Manage roles, departments, ministries, and more from this dashboard. Click any option to proceed.
      </p>

      {/* Dashboard Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        
        {/* SuperAdmin Role Dashboard */}
        <div className="flex justify-center">
          <Link to="/role-dashboard">
            <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center">
              <FaUserShield className="mr-2 text-xl" />
              <span>Manage Admin Roles</span>
            </button>
          </Link>
        </div>

        {/* Add Manager Dashboard */}
        <div className="flex justify-center">
          <Link to="/addmanager-dashboard">
            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center justify-center">
              <FaUsersCog className="mr-2 text-xl" />
              <span>Add or Remove Managers</span>
            </button>
          </Link>
        </div>

        {/* Add Ministry Dashboard */}
        <div className="flex justify-center">
          <Link to="/addministry-dashboard">
            <button className="w-full bg-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
              <FaBuilding className="mr-2 text-xl" />
              <span>Add or Remove Ministries</span>
            </button>
          </Link>
        </div>

        {/* Add Department Dashboard */}
        <div className="flex justify-center">
          <Link to="/adddept-dashboard">
            <button className="w-full bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300 flex items-center justify-center">
              <FaLayerGroup className="mr-2 text-xl" />
              <span>Add or Remove Departments</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;

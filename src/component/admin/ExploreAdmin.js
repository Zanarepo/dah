import React from 'react';
//import { Link } from 'react-router-dom';
import Backfunction from '../MinistryDashboard/Backfunction';

const ExploreAdminDashboard = () => {
  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Explore Admin Dashboard</h1>
        <Backfunction/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Notifications</h2>
            <p className="text-gray-600">View all notifications related to teams and employees across ministries.</p>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-teal-600 mb-2">Employees</h2>
            <p className="text-gray-600">Access a combined list of all employees in the department.</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-orange-600 mb-2">Department</h2>
            <p className="text-gray-600">Track and manage all vacations and updates.</p>
          </div>

          <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-pink-600 mb-2">BuzzMe</h2>
            <p className="text-gray-600">Use the chat app for easy communication across departments.</p>
          </div>

          <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-cyan-600 mb-2">Task Board</h2>
            <p className="text-gray-600">Manage tasks, assign responsibilities, and track updates.</p>
          </div>

          <div className="bg-lime-50 border-l-4 border-lime-400 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-lime-600 mb-2">Attendance</h2>
            <p className="text-gray-600">View attendance and absence records for all employees in the department.</p>
          </div>

          <div className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-rose-600 mb-2">Issue Tracker</h2>
            <p className="text-gray-600">Manage queries and challenges efficiently across the department.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreAdminDashboard;

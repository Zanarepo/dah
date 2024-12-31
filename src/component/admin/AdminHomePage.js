import React from 'react';
import { Link } from 'react-router-dom';

const AdminHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 my-6">Welcome, Admin!</h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          As an admin, you have powerful tools to effectively manage your teams and ensure smooth operations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Assign Roles</h2>
            <p className="text-gray-600">
              Manage access levels by assigning roles to other admins, ensuring structured and secure operations.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Manage Departments</h2>
            <p className="text-gray-600">
              Create, update, and manage organizational units for seamless task assignments and employee grouping.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-yellow-600 mb-2">Approve Leave & Handle Queries</h2>
            <p className="text-gray-600">
              Review leave requests and address employee concerns to maintain a balanced and supportive work environment.
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">Monitor Employee Activities</h2>
            <p className="text-gray-600">
              Keep track of employee performance, attendance, and task completion to ensure productivity.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Assign Tasks</h2>
            <p className="text-gray-600">
              Distribute work efficiently by assigning tasks to employees based on their roles and capabilities.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/onboard" className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-700 transition">
            Explore Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
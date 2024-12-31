import React from 'react';
import Backfunction from '../MinistryDashboard/Backfunction';

const ExploreAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-0"> {/* Remove extra padding on left and right */}
      <div className="w-full bg-white shadow-lg rounded-lg p-4 md:px-8 lg:px-16"> {/* Adjust padding for larger screens */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Explore Admin Dashboard</h1>
        <Backfunction/>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"> {/* Reduce gap for mobile screens */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md shadow-md hover:shadow-lg transition w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Add Department Dashboard</h2>
            <p className="text-gray-600">Manage and add departments effectively within the workforce.</p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-md hover:shadow-lg transition w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-green-600 mb-2">Add/Remove Ministry Dashboard</h2>
            <p className="text-gray-600">Easily manage departments within the system.</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-md hover:shadow-lg transition w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-yellow-600 mb-2">Access Level Roles</h2>
            <p className="text-gray-600">Define and manage roles for structured access control.</p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-md shadow-md hover:shadow-lg transition w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-purple-600 mb-2">Admin Assignment</h2>
            <p className="text-gray-600">Assign roles and responsibilities to admins across departments</p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-md hover:shadow-lg transition w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-red-600 mb-2">Add Department Dashboard</h2>
            <p className="text-gray-600">Add new Department to expand and manage workforce distribution.</p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-md shadow-md w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Notifications</h2>
            <p className="text-gray-600">View all notifications related to teams and employees across Department.</p>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-md shadow-md w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-teal-600 mb-2">Employees</h2>
            <p className="text-gray-600">Access a combined list of all employees in the entire workforce.</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-md shadow-md w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-orange-600 mb-2">Ministries</h2>
            <p className="text-gray-600">Track and manage all ministries, including vacations and updates.</p>
          </div>

          <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-md shadow-md w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-pink-600 mb-2">BuzzMe</h2>
            <p className="text-gray-600">Use the chat app for easy communication across departments.</p>
          </div>

          <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-md shadow-md w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-cyan-600 mb-2">Task Board</h2>
            <p className="text-gray-600">Manage tasks, assign responsibilities, and track updates.</p>
          </div>

          <div className="bg-lime-50 border-l-4 border-lime-400 p-4 rounded-md shadow-md w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-lime-600 mb-2">Attendance</h2>
            <p className="text-gray-600">View attendance and absence records for all employees.</p>
          </div>

          <div className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-md shadow-md w-full"> {/* Full width grid item */}
            <h2 className="text-xl font-semibold text-rose-600 mb-2">Issue Tracker</h2>
            <p className="text-gray-600">Manage queries and challenges efficiently across departments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreAdminDashboard;

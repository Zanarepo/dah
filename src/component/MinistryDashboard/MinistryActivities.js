import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { SunIcon, BriefcaseIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Backfunction from './Backfunction';


const MinistryActivities = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const navigateTo = (path) => {
    navigate(path); // Navigate to the desired path
  };

 

  return (
    <div className="min-w-full max-w-7xl mx-auto p-4 space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Ministry Activities</h2>
     
      {/* Back Button */}
      
          <Backfunction />
       
      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Vacation Tracker Section */}
        <div 
          onClick={() => navigateTo("/minvacation")}
          className="flex flex-col items-center justify-center bg-yellow-100 p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer text-center"
        >
          <SunIcon className="w-12 h-12 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-yellow-700">Vacation Tracker</h3>
          <p className="text-gray-500 mt-2">Track employees on vacation and their statuses.</p>
        </div>

        {/* Ministry Dashboard Section */}
        <div 
          onClick={() => navigateTo("/adminministry")}
          className="flex flex-col items-center justify-center bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer text-center"
        >
 
          <BriefcaseIcon className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold text-blue-700">Ministry Dashboard</h3>
          <p className="text-gray-500 mt-2">Manage ministry settings and department structure.</p>
        </div>

        {/* Ministry Leave Section */}
        <div 
          onClick={() => navigateTo("/ministry-leave")}
          className="flex flex-col items-center justify-center bg-green-100 p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer text-center"
        >
          <ClipboardDocumentListIcon className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-green-700">Ministry Leave</h3>
          <p className="text-gray-500 mt-2">Approve and track leave requests within the ministry.</p>
        </div>
        
      </div>
    </div>
  );
};

export default MinistryActivities;

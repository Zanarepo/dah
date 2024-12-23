import React, { useState, Suspense, lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './parallaxTransitions.css'; // Ensure this file has the correct styles

// Lazy loading the views for better performance
const CheckIn = lazy(() => import('../Productivity/Attendance')); // Make sure the path is correct
const EmployeeCheckins = lazy(() => import('../Productivity/EmployeeAttendance')); // Make sure the path is correct
const CalendarView = lazy(() => import('../Productivity/Calendar')); // Make sure the path is correct

const AttendanceDashboard = () => {
  const [currentView, setCurrentView] = useState('checkin');

  // Handle switching between views
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-6 overflow-hidden"> {/* Prevent external scrolling */}
      <ToastContainer />
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Attendance Dashboard</h1>
      
      {/* Button for navigation between views */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleViewChange('checkin')}
          className={`px-6 py-3 rounded-lg ${currentView === 'checkin' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'} transition duration-300`}
        >
          CheckIn : CheckOut
        </button>
        <button
          onClick={() => handleViewChange('employee-checkins')}
          className={`px-6 py-3 rounded-lg ${currentView === 'employee-checkins' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'} transition duration-300`}
        >
          Attendance Summary
        </button>
        <button
          onClick={() => handleViewChange('calendar')}
          className={`px-6 py-3 rounded-lg ${currentView === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'} transition duration-300`}
        >
          Calendar / Calendar View
        </button>
      </div>

      {/* Transition between views */}
      <div className="w-full max-w-3xl px-4 overflow-y-auto"> {/* Allow scrolling only within the component */}
        <TransitionGroup>
          <CSSTransition key={currentView} timeout={800} classNames="parallax">
            <div className="w-full p-0 rounded-lg shadow-lg">
              <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
                {currentView === 'checkin' && <CheckIn />}
                {currentView === 'employee-checkins' && <EmployeeCheckins />}
                {currentView === 'calendar' && <CalendarView />}
              </Suspense>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default AttendanceDashboard;

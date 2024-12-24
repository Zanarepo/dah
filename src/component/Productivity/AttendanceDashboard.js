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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-4 px-2 md:py-6 md:px-6">
      <ToastContainer />
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 md:mb-6 text-center">
        Attendance Dashboard
      </h1>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 w-full max-w-2xl">
        <button
          onClick={() => handleViewChange('checkin')}
          className={`flex-1 min-w-[120px] px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base ${currentView === 'checkin' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'} transition duration-300`}
        >
          CheckIn : CheckOut
        </button>
        <button
          onClick={() => handleViewChange('employee-checkins')}
          className={`flex-1 min-w-[120px] px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base ${currentView === 'employee-checkins' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'} transition duration-300`}
        >
          Attendance Summary
        </button>
        <button
          onClick={() => handleViewChange('calendar')}
          className={`flex-1 min-w-[120px] px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base ${currentView === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'} transition duration-300`}
        >
          Calendar View
        </button>
      </div>

      {/* Transition between views */}
      <div className="w-full max-w-full sm:max-w-lg md:max-w-3xl px-2">
        <TransitionGroup>
          <CSSTransition key={currentView} timeout={800} classNames="parallax">
            <div className="w-full">
              <Suspense fallback={<div className="text-center text-xl text-gray-600">Loading...</div>}>
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

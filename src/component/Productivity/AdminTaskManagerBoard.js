import React, { useState, Suspense, lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './parallaxTransitions.css';

// Lazy load components
const AdminTaskAssignment = lazy(() => import('./AdminTaskAssignment'));
const TaskTracking = lazy(() => import('./TaskTracking'));
const PerformanceDashboard = lazy(() => import('./PerformanceDashboard'));

const AdminTaskManagerBoard = () => {
  const [currentView, setCurrentView] = useState('assignment');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Admin Task Manager</h1>

      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleViewChange('assignment')}
          className={`px-4 py-2 rounded-lg ${
            currentView === 'assignment' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}
        >
          Task Assignment
        </button>
        <button
          onClick={() => handleViewChange('tracking')}
          className={`px-4 py-2 rounded-lg ${
            currentView === 'tracking' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}
        >
          Task Tracking
        </button>
        <button
          onClick={() => handleViewChange('performance')}
          className={`px-4 py-2 rounded-lg ${
            currentView === 'performance' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}
        >
          Performance Dashboard
        </button>
      </div>

      {/* Component Rendering */}
      <div className="w-full">
        <TransitionGroup>
          <CSSTransition key={currentView} timeout={800} classNames="parallax">
            <div className="w-full p-0 rounded-lg shadow-lg bg-white">
              <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
                {currentView === 'assignment' && <AdminTaskAssignment />}
                {currentView === 'tracking' && <TaskTracking />}
                {currentView === 'performance' && <PerformanceDashboard />}
              </Suspense>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default AdminTaskManagerBoard;

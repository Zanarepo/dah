import React, { useState, Suspense, lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './parallaxTransitions.css';

const EmployeeTaskManager = lazy(() => import('./EmployeeTaskManager'));
const TodoList = lazy(() => import('./TodoList'));

const EmployeeTaskManagerDashboard = () => {
  const [currentView, setCurrentView] = useState('assigned');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Task Management</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleViewChange('assigned')}
          className={`px-4 py-2 rounded-lg ${currentView === 'assigned' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
        >
          Assigned Tasks
        </button>
        <button
          onClick={() => handleViewChange('personal')}
          className={`px-4 py-2 rounded-lg ${currentView === 'personal' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
        >
          Personal Tasks
        </button>
      </div>
      <div className="w-full">
        <TransitionGroup>
          <CSSTransition key={currentView} timeout={800} classNames="parallax">
            <div className="w-full p-0 rounded-lg shadow">
              <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
                {currentView === 'assigned' ? <EmployeeTaskManager /> : <TodoList />}
              </Suspense>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default EmployeeTaskManagerDashboard;

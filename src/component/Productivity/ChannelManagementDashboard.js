import React, { useState, Suspense, lazy } from 'react'; 
import { ToastContainer, toast } from 'react-toastify';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './parallaxTransitions.css';

// Lazy load components
const ChannelMembersDashboard = lazy(() => import('./ChannelMembersDashboard'));
const ManageChannel = lazy(() => import('./ManageChannel'));

const ChannelManagementDashboard = () => {
  const [currentView, setCurrentView] = useState('members');

  const handleViewChange = (view) => {
    setCurrentView(view);
    
    // Show a toast when switching views
    const toastId = toast.info(`Switched to ${view} view`, {
      autoClose: 3000,  // Automatically closes after 3 seconds
      toastId: 'viewChangeToast',  // Use a unique toast ID to identify this toast
      onClose: () => {
        // Optional: Trigger something when the toast closes
        console.log('Toast closed');
      },
    });

    // Ensure that we are not creating duplicates and dismissing any active toast with the same ID
    if (toast.isActive(toastId)) {
      toast.dismiss(toastId);  // Dismiss the previous one if still active
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* ToastContainer setup */}
      <ToastContainer
        autoClose={3000}  // Set autoClose for 3 seconds for all toasts
        closeButton={true}  // Allow manual close button for user interaction
      />

      <h1 className="text-3xl font-bold text-blue-700 mb-4">Channels Manager</h1>

      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleViewChange('members')}
          className={`px-4 py-2 rounded-lg ${currentView === 'members' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
        >
          Channel Members
        </button>
        <button
          onClick={() => handleViewChange('manage')}
          className={`px-4 py-2 rounded-lg ${currentView === 'manage' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
        >
          Manage Channel
        </button>
      </div>

      {/* Component Rendering */}
      <div className="w-full">
        <TransitionGroup>
          <CSSTransition key={currentView} timeout={800} classNames="parallax">
            <div className="w-full p-0 rounded-lg shadow-lg bg-white">
              <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
                {currentView === 'members' && <ChannelMembersDashboard />}
                {currentView === 'manage' && <ManageChannel />}
              </Suspense>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default ChannelManagementDashboard;

import React, { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import { ToastContainer, toast } from "react-toastify"; // Importing toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify
import "../Productivity/parallaxTransitions.css";

// Lazy load the tab components (Ensure the path is correct)
const DepartmentManagement = lazy(() => import("../SuperAdmins/SuperAdmin"));
const DisplaySettings = lazy(() => import("../SuperAdmins/DisplaySettings"));
const ChannelManagementDashboard = lazy(() => import("../Productivity/ChannelManagementDashboard"));

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState("departmentManagement");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    toast.success("You have successfully logged out!"); // Display success toast
    setTimeout(() => navigate("/login"), 1500); // Redirect after 1.5 seconds to allow toast to show
  };

  const handleModalClose = (confirmLogout) => {
    setShowModal(false); // Close modal
    if (confirmLogout) {
      handleLogout(); // Proceed with logout if confirmed
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "departmentManagement":
        return <DepartmentManagement />;
      case "displaySettings":
        return <DisplaySettings />;
      case "channel-management":
        return <ChannelManagementDashboard />;
      default:
        return <DepartmentManagement />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 mt-4">
        Super Admin Settings
      </h1>

      {/* Tab Buttons (Horizontally aligned) */}
      <div className="flex space-x-4 mb-6 w-full justify-center">
        <button
          onClick={() => setActiveTab("departmentManagement")}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "departmentManagement"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          Dept/Ministry Manager
        </button>
         {/*<button
          onClick={() => setActiveTab("displaySettings")}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "displaySettings"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
       Tab Buttons (Horizontally aligned)    Display Settings
        </button>
*/} 
        <button
          onClick={() => setActiveTab("channel-management")}
          className={`px-6 py-2 rounded-lg ${
            activeTab === "channel-management"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          Channel Management
        </button>
      </div>

      {/* Tab Content with Smooth Transition */}
      <div className="w-full flex-grow flex justify-center items-center">
        <TransitionGroup>
          <CSSTransition key={activeTab} timeout={800} classNames="parallax">
            <div className="w-full p-0 rounded-lg shadow-lg">
              <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
                {renderTabContent()}
              </Suspense>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>

      {/* Logout Button with Icon */}
      <div className="mt-4 mb-4">
        <button
          onClick={() => setShowModal(true)} // Show modal on button click
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
        >
          <FiLogOut className="h-5 w-5 mr-2" /> {/* Logout icon */}
          Logout
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
            {/* Centered Text */}
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h2>
              <p className="text-gray-700 mb-4">Are you sure you want to log out?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleModalClose(false)} // Close modal without logout
                  className="px-4 py-2 bg-gray-300 rounded-md text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleModalClose(true)} // Proceed with logout
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer autoClose={3000} closeButton={false} />
    </div>
  );
};

export default SuperAdminSettings;

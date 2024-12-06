import React, { useState } from "react";
import Sidebar from "./Sidebar";  // Sidebar component
import Navbar from "./Navbar";    // Assuming you have a Navbar component

const Dashboard = () => {
  const [ministry, setMinistry] = useState(null);
  const [department, setDepartment] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Track if sidebar is open or closed

  const handleSelectMinistry = () => {
    setMinistry("Finance");
    setDepartment("HR");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64 ml-0" : "md:ml-64 ml-0"
        }`} // Content starts after sidebar width
      >
        {/* Navbar */}
        <Navbar
          ministry={ministry}
          department={department}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <main className="p-4">
          {!ministry || !department ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold mb-4">
                Please select a Ministry and Department to continue.
              </p>
              <button
                onClick={handleSelectMinistry}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Select Ministry & Department
              </button>
            </div>
          ) : (
            <h1>Welcome to the {department} Department in {ministry} Ministry</h1>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;







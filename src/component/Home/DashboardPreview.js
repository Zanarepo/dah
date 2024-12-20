import React, { useState, useEffect } from "react";

const DashboardPreview = () => {
  const [totalEmployees, setTotalEmployees] = useState(12345);
  const [pendingLeaves, setPendingLeaves] = useState(78);
  const [tasksCompleted, setTasksCompleted] = useState(1234);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change the numbers to simulate real-time data updates
      setTotalEmployees(prev => prev + Math.floor(Math.random() * 100));
      setPendingLeaves(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
      setTasksCompleted(prev => prev + Math.floor(Math.random() * 20));
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="dashboard-preview bg-blue-100 p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Dashboard Preview</h2>
      <div className="dashboard-demo bg-white shadow p-6 rounded">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card p-4 bg-blue-500 text-white text-center rounded">
            <h3 className="text-lg font-bold">Total Employees</h3>
            <p className="text-3xl mt-2">{totalEmployees.toLocaleString()}</p>
          </div>
          <div className="stat-card p-4 bg-green-500 text-white text-center rounded">
            <h3 className="text-lg font-bold">Pending Leaves</h3>
            <p className="text-3xl mt-2">{pendingLeaves}</p>
          </div>
          <div className="stat-card p-4 bg-red-500 text-white text-center rounded">
            <h3 className="text-lg font-bold">Tasks Completed</h3>
            <p className="text-3xl mt-2">{tasksCompleted.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;

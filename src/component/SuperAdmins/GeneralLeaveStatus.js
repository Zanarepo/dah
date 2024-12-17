import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import {  FaArrowLeft } from "react-icons/fa";

const LeaveTracker = () => {
  const [leaveStats, setLeaveStats] = useState({
    approved: 0,
    pending: 0,
    expired: 0,
    rejected: 0,
    active: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const adminEmployeeId = localStorage.getItem("employee_id");

  useEffect(() => {
    const fetchLeaveStats = async () => {
      try {
        setIsLoading(true);

        const { data: adminData, error: adminError } = await supabase
          .from("department_admins")
          .select("department_id")
          .eq("employee_id", adminEmployeeId)
          .maybeSingle();

        if (adminError) throw adminError;

        if (!adminData) {
          setError("You are not assigned to any department.");
          return;
        }

        const { data, error: leaveError } = await supabase
          .from("employee_leave")
          .select("*")
          .eq("department_id", adminData.department_id);

        if (leaveError) throw leaveError;

        if (!data.length) {
          setError("No leave data found.");
          return;
        }

        const currentDate = new Date();
        setLeaveStats({
          approved: data.filter((leave) => leave.status === "Approved").length,
          pending: data.filter((leave) => leave.status === "Pending").length,
          rejected: data.filter((leave) => leave.status === "Rejected").length,
          expired: data.filter(
            (leave) =>
              leave.status === "Approved" && new Date(leave.end_date) < currentDate
          ).length,
          active: data.filter(
            (leave) =>
              leave.status === "Approved" &&
              new Date(leave.start_date) <= currentDate &&
              new Date(leave.end_date) >= currentDate
          ).length,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveStats();
  }, [adminEmployeeId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="max-w-6xl mx-auto py-6 px-4">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
          Leave Tracker
        </h1>

        {isLoading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(leaveStats).map(([key, value]) => (
              <div
                key={key}
                className="p-6 bg-white shadow rounded-lg text-center"
              >
                <div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 ${
                    key === "approved"
                      ? "border-green-500"
                      : key === "pending"
                      ? "border-blue-500"
                      : key === "rejected"
                      ? "border-red-500"
                      : key === "expired"
                      ? "border-yellow-500"
                      : "border-gray-500"
                  }`}
                >
                  <span className="text-xl font-bold">{value}</span>
                </div>
                <h2 className="text-xl mt-4 capitalize font-bold text-gray-700">
                  {key}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveTracker;

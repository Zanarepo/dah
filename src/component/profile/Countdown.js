import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Assuming you have a Supabase client setup

const Countdown = ({ leaveId, employeeId }) => {
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [timer, setTimer] = useState(null);
  const [isLeaveActive, setIsLeaveActive] = useState(false);

  // Fetch the leave details from Supabase
  useEffect(() => {
    const fetchLeaveDetails = async () => {
      const { data, error } = await supabase
        .from("employee_leave")
        .select("start_date, status, employee_profiles (first_name, last_name)")
        .eq("id", leaveId)
        .eq("employee_id", employeeId)
        .single(); // Since we are querying for a single leave record

      if (error) {
        console.error(error);
      } else {
        setLeaveDetails(data);
      }
    };

    fetchLeaveDetails();
  }, [leaveId, employeeId]);

  // Set up the countdown timer when leave is approved and start date is available
  useEffect(() => {
    if (leaveDetails && leaveDetails.status === "Approved" && leaveDetails.start_date) {
      const startDate = new Date(leaveDetails.start_date);

      // Function to update the timer
      const updateTimer = () => {
        const now = new Date();
        const timeDifference = startDate - now; // Difference in milliseconds

        if (timeDifference <= 0) {
          setIsLeaveActive(true); // Start leave immediately
          setTimer(null); // Remove the timer when the leave starts
        } else {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          setTimer({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      };

      updateTimer(); // Set the initial timer immediately

      const interval = setInterval(updateTimer, 1000); // Update every second

      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, [leaveDetails]);

  return (
    leaveDetails && (
      <div>
        {/* Show countdown until leave starts */}
        {!isLeaveActive && timer && (
          <div className="leave-countdown bg-yellow-100 p-4 rounded-md">
            <h3 className="font-semibold">
              {leaveDetails.employee_profiles.first_name} {leaveDetails.employee_profiles.last_name}&lsquo;
              Leave Countdown
            </h3>
            <p className="text-gray-700">
              Leave starts in:
              <span className="font-bold">
                {timer.days}d {timer.hours}h {timer.minutes}m {timer.seconds}s
              </span>
            </p>
          </div>
        )}

        {/* When leave starts, notify and disappear the component */}
        {isLeaveActive && (
          <div className="leave-active bg-green-100 p-4 rounded-md">
            <h3 className="font-semibold text-green-600">
              {leaveDetails.employee_profiles.first_name} {leaveDetails.employee_profiles.last_name} has
              embarked on leave.
            </h3>
          </div>
        )}
      </div>
    )
  );
};

export default Countdown;

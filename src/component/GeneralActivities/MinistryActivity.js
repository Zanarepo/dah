import React, { useState, useEffect } from "react";
import SearchComponent from "./SearchComponent";

const MinistryActivity = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Fetch data for birthdays, employees on leave, and events
  useEffect(() => {
    fetchBirthdays();
    fetchEmployeesOnLeave();
    fetchUpcomingEvents();
  }, []);

  const fetchBirthdays = async () => {
    const response = await fetch("/api/birthdays");
    const data = await response.json();
    setBirthdays(data);
  };

  const fetchEmployeesOnLeave = async () => {
    const response = await fetch("/api/employees-on-leave");
    const data = await response.json();
    setEmployeesOnLeave(data);
  };

  const fetchUpcomingEvents = async () => {
    const response = await fetch("/api/upcoming-events");
    const data = await response.json();
    setUpcomingEvents(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ministry Activity</h1>

      {/* Search Component */}
      <SearchComponent />

      {/* Upcoming Events */}
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <ul className="space-y-2">
            {upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="p-4 border rounded bg-gray-100 shadow-sm"
              >
                <p>
                  <strong>Event:</strong> {event.title}
                </p>
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>

      {/* Birthdays */}
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-2">Upcoming Birthdays</h2>
        {birthdays.length > 0 ? (
          <ul className="space-y-2">
            {birthdays.map((birthday) => (
              <li
                key={birthday.id}
                className="p-4 border rounded bg-gray-100 shadow-sm"
              >
                <p>
                  <strong>Name:</strong> {birthday.name}
                </p>
                <p>
                  <strong>Birthday:</strong> {birthday.date}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming birthdays.</p>
        )}
      </div>

      {/* Employees on Leave */}
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-2">Employees on Leave</h2>
        {employeesOnLeave.length > 0 ? (
          <ul className="space-y-2">
            {employeesOnLeave.map((leave) => (
              <li
                key={leave.id}
                className="p-4 border rounded bg-gray-100 shadow-sm"
              >
                <p>
                  <strong>Name:</strong> {leave.name}
                </p>
                <p>
                  <strong>Leave Type:</strong> {leave.leave_type}
                </p>
                <p>
                  <strong>Return Date:</strong> {leave.return_date}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No employees currently on leave.</p>
        )}
      </div>
    </div>
  );
};

export default MinistryActivity;

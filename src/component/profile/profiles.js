import React, { useState, useEffect } from "react";
import EmployeePersonalDetails from "./EmployeePersonalDetails";
import EmployeeEmploymentDetails from "./EmployeeEmploymentDetails";
import Leave from "./Leave";
import Notifications from "../admin/Notification";

import { supabase } from "../../supabaseClient"; // Ensure your Supabase client is correctly imported

const ProfileForm = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [employeeData, setEmployeeData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    phone_number: "",
    address: "",
    marital_status: "",
    sex: "",
    nationality: "",
    state_of_origin: "",
    lga_of_origin: "",
    employment_date: "",
    employment_type: "",
    department: "",
    position: "",
    grade_level: "",
    step: "",
    manager: "",
    qualification: "",
    annual_leave: 21, // Default value
    years_in_service: "",
    retirement_date: "",
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(""); // Track error state

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employee_id"); // Assuming employee_id is stored in localStorage
    console.log("Stored Employee ID: ", storedEmployeeId); // Debugging log

    if (storedEmployeeId) {
      const fetchEmployeeData = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("employee_profiles") // Use the correct table name here
            .select("*")
            .eq("employee_id", storedEmployeeId)
            .single(); // Fetch a single record

          if (error) {
            console.error("Supabase error: ", error); // Log error
            throw error;
          }

          setEmployeeData(data); // Set the employee data in the state
          setLoading(false); // Data fetched, stop loading
        } catch (error) {
          setError("Failed to load employee data.");
          setLoading(false);
          console.error("Data fetch error: ", error); // Log detailed error
        }
      };

      fetchEmployeeData();
    } else {
      setError("Employee ID not found.");
      setLoading(false);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted", employeeData);
    // Implement form submission logic, e.g., saving data to Supabase or API
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error if something goes wrong
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4 h-screen">
        <h2 className="font-semibold text-lg mb-4">Profile Sections</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleSectionChange("personal")}
              className={`w-full text-left p-2 rounded ${
                activeSection === "personal" ? "bg-blue-500 text-white" : "bg-transparent"
              }`}
            >
              Personal Details
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionChange("employment")}
              className={`w-full text-left p-2 rounded ${
                activeSection === "employment" ? "bg-blue-500 text-white" : "bg-transparent"
              }`}
            >
              Employment Details
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionChange("leaveRetirement")}
              className={`w-full text-left p-2 rounded ${
                activeSection === "leaveRetirement" ? "bg-blue-500 text-white" : "bg-transparent"
              }`}
            >
              Leave & Retirement Dashboard
            </button>
          </li>
        </ul>
      </div>

      {/* Main Form Area */}
      <div className="w-3/4 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeSection === "personal" && (
            <EmployeePersonalDetails
              employeeData={employeeData}
              setEmployeeData={setEmployeeData}
            />
          )}
          {activeSection === "employment" && (
            <EmployeeEmploymentDetails
              employeeData={employeeData}
              setEmployeeData={setEmployeeData}
            />
          )}
          {activeSection === "leaveRetirement" && (
            <LeaveRetirementDashboard
              employeeData={employeeData}
              setEmployeeData={setEmployeeData}
            />
          )}

{activeSection === "leaveRetirement" && (
            <Leave
              employeeData={employeeData}
              setEmployeeData={setEmployeeData}
            />
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;

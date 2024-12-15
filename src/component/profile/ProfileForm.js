import React, { useState, useEffect } from "react";
import EmployeePersonalDetails from "./EmployeePersonalDetails";
import EmployeeEmploymentDetails from "./EmployeeEmploymentDetails";
import Leave from "./Leave";
import Notifications from "../admin/Notification";

import { supabase } from "../../supabaseClient"; // Ensure your supabase client is correctly imported
import ChatApp from "../Chat/ChatApp";

const ProfilePage = () => {
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
    // Get the employee_id from localStorage or other means
    const storedEmployeeId = localStorage.getItem("employee_id"); // Assuming employee_id is stored in localStorage
    console.log("Stored Employee ID: ", storedEmployeeId); // Debugging log

    if (storedEmployeeId) {
      // Fetch the employee data from Supabase based on the employee_id
      const fetchEmployeeData = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("employee_profiles")  // Use the correct table name here
            .select("*")
            .eq("employee_id", storedEmployeeId)
            .single(); // Fetch a single record

          if (error) {
            console.error("Supabase error: ", error); // Log error
            throw error;
          }

          // Set the employee data in the state
          setEmployeeData(data);
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

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted", employeeData);

    try {
      // Update the personal details in Supabase
      const { data, error } = await supabase
        .from("employee_profiles") // Use the correct table name
        .upsert([employeeData], { onConflict: ["employee_id"] }); // Use upsert to insert or update

      if (error) {
        console.error("Error updating data: ", error);
        setError("Failed to update employee data.");
        return;
      }

      // Success feedback
      console.log("Employee data successfully updated:", data);
      // Optionally, show a success message to the user or navigate to a different page
    } catch (error) {
      console.error("Unexpected error: ", error);
      setError("Failed to update employee data.");
    }
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
              onClick={() => handleSectionChange("leave")}
              className={`w-full text-left p-2 rounded ${
                activeSection === "leave" ? "bg-blue-500 text-white" : "bg-transparent"
              }`}
            >
              Leave Zone
            </button>
          </li>
          {/* Profile Button */}
          <li>
            <button
              onClick={() => handleSectionChange("notifications")}  // Change to "notifications"
              className={`w-full text-left p-2 rounded ${
                activeSection === "notifications" ? "bg-blue-500 text-white" : "bg-transparent"
              }`}
            >
              Notifications
            </button>
          </li>
        </ul>
        
        <li>
            <button
              onClick={() => handleSectionChange("chatapp")}  // Change to "notifications"
              className={`w-full text-left p-2 rounded ${
                activeSection === "chatapp" ? "bg-blue-500 text-white" : "bg-transparent"
              }`}
            >
              Hello
            </button>
          </li>
        
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
        </form>
          {activeSection === "leave" && (
            <Leave
              employeeData={employeeData}
              setEmployeeData={setEmployeeData}
            />
          )}
          {/* Profile Section */}
          {activeSection === "notifications" && (
            <Notifications employee_id={employeeData.employee_id} />  // Passing employee_id as prop
          )}

           {/* Profile Section */}
           {activeSection === "chatapp" && (
            <ChatApp employee_id={employeeData.employee_id} />  // Passing employee_id as prop
          )}

</div>
      </div>
    
  );
};

export default ProfilePage;

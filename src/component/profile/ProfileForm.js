import React, { useState } from "react";
import EmployeePersonalDetails from "./EmployeePersonalDetails";
import EmployeeEmploymentDetails from "./EmployeeEmploymentDetails";
import EmployeeLeaveRetirementDetails from "./EmployeeLeaveRetirementDetails";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted", employeeData);
    // Implement form submission logic, e.g., saving data to Supabase or API
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

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
              Leave & Retirement Details
            </button>
          </li>
        </ul>
      </div>

      {/* Main Form Area */}
      <div className="w-3/4 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeSection === "personal" && (
            <EmployeePersonalDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />
          )}
          {activeSection === "employment" && (
            <EmployeeEmploymentDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />
          )}
          {activeSection === "leaveRetirement" && (
            <EmployeeLeaveRetirementDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />
          )}
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;

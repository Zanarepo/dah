// src/components/ProfileForm.js
import React, { useState } from "react";
import EmployeePersonalDetails from "./EmployeePersonalDetails";
import EmployeeEmploymentDetails from "./EmployeeEmploymentDetails";
import EmployeeLeaveRetirementDetails from "./EmployeeLeaveRetirementDetails";

const ProfileForm = () => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmployeePersonalDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />
      <EmployeeEmploymentDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />
      <EmployeeLeaveRetirementDetails employeeData={employeeData} setEmployeeData={setEmployeeData} />
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Submit
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;

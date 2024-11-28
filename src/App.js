import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import EmployeePersonalDetails from "./component/profile/EmployeePersonalDetails";
import EmployeeEmploymentDetails from "./component/profile/EmployeeEmploymentDetails";
import EmployeeLeaveRetirementDetails from "./component/profile/EmployeeLeaveRetirementDetails";
import ProfileForm from "./component/profile/ProfileForm";
import EmployeeForm from "./component/admin/EmployeeForm";
import LoginForm from "./component/auth/LoginForm";
import AdminPanel from "./component/admin/AdminPanel";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the main profile form that includes all sections */}
          <Route path="/" element={<AdminPanel/>} />
          <Route path="profile" element={<ProfileForm />} />

          {/* Routes for each specific section of the profile form */}
          <Route path="/personal-details" element={<EmployeePersonalDetails />} />
          <Route path="/employment-details" element={<EmployeeEmploymentDetails />} />
          <Route path="/leave-retirement-details" element={<EmployeeLeaveRetirementDetails />} />
          <Route path="/register" element={<EmployeeForm/>} />
          <Route path="/login" element={<LoginForm/>} />
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

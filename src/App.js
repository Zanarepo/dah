import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import EmployeePersonalDetails from "./component/profile/EmployeePersonalDetails";
import EmployeeEmploymentDetails from "./component/profile/EmployeeEmploymentDetails";
import ProfileForm from "./component/profile/ProfileForm";
import EmployeeForm from "./component/admin/EmployeeForm";
import ActivateAccount from "./component/admin/ActivateAccount";
import Leave from "./component/profile/Leave";
import LeaveHistory from "./component/profile/LeaveHistory.js";
import LoginForm from "./component/auth/LoginForm";
import RoleSelection from "./component/auth/RoleSelection";
import AssignAdminRoles from "./component/auth/AssignAdminRoles";
import AdminPanel from "./component/admin/AdminPanel";
//import LeaveApproval from "./component/admin/LeaveApproval";
import MinistryActivity from "./component/GeneralActivities/MinistryActivity";
import Settings from "./component/admin/Settings";
import PopulateMinistries from "./component/admin/PopulateMinistries";
import RegistrationForm from "./component/admin/RegistrationForm";
import ForgotPassword from "./component/auth/ForgotPassword";
import LeaveApproval from "./component/auth/LeaveApproval";
import Countdown from "./component/profile/Countdown";
import LeaveTracking from "./component/auth/LeaveTracking;"; 
import LeaveApprovalDetail from "./component/auth/LeaveApprovalDetail"; 
import AssignManager from "./component/admin/AssignManager"
import MakeManager from "./component/admin/MakeManager"
import AddManager from "./component/admin/AddManager"




















function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the main profile form that includes all sections */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/general" element={<MinistryActivity />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/role-selection" element={<RoleSelection />}/> 
          <Route path="/assign" element={<AssignManager />}/> 
          <Route path="/make" element={<MakeManager />}/> 
          <Route path="/addmanager" element={<AddManager />}/>

       

          <Route path="/leave" element={<Leave />} />
          <Route path="/History" element={<LeaveHistory />} />
          <Route path="/leave-approval" element={<LeaveApproval />} /> 
          <Route path="/leave-track" element={<LeaveTracking />} />
          <Route path="/count" element={<Countdown />} /> 
          <Route path="/mini" element={<PopulateMinistries />} />
          <Route path="/details" element={<LeaveApprovalDetail />} />

          {/* Routes for each specific section of the profile form */}
          <Route path="/personal-details" element={<EmployeePersonalDetails />} />
          <Route path="/employment-details" element={<EmployeeEmploymentDetails />} />
        
 
          <Route path="/register" element={<EmployeeForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/super-admin" element={<AssignAdminRoles />} />
  
          <Route path="/settings" element={<Settings />} />
          <Route path="/reg" element={<RegistrationForm />} />
          <Route path="/activate" element={<ActivateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

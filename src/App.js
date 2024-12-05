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
import LeaveApproval from "./component/profile/LeaveApproval";
import MinistryActivity from "./component/GeneralActivities/MinistryActivity";
import Settings from "./component/admin/Settings";
import PopulateMinistries from "./component/admin/PopulateMinistries";
import RegistrationForm from "./component/admin/RegistrationForm";
import ForgotPassword from "./component/auth/ForgotPassword";

import Countdown from "./component/profile/Countdown";
import LeaveTracking from "./component/auth/LeaveTracking.js"; 
import LeaveApprovalDetail from "./component/auth/LeaveApprovalDetail"; 
import AssignManager from "./component/admin/AssignManager";
import MakeManager from "./component/admin/MakeManager";
import AddManager from "./component/admin/AddManager";
import AddMinistryForm from "./component/admin/AddMinistryForm";
import AddDepartment from "./component/admin/AddDepartment";
import CreateManager from "./component/admin/CreateManager";
import ManageDepartmentManager from "./component/admin/ManageDepartmentManager";
import UnassignManagerFromDepartments from "./component/admin/UnassignManagerFromDepartments"
import RemoveManagerFromEmployee from "./component/admin/RemoveManagerFromEmployee"
import DeleteManager from "./component/admin/DeleteManager"
import RemoveMinistry  from "./component/admin/RemoveMinistry"
import RemoveDepartment from "./component/admin/RemoveDepartment"
import LeaveCancel from "./component/profile/LeaveCancel"
import LeaveStatusTracker from "./component/profile/LeaveStatusTracker"
import OnVacation from "./component/profile/OnVacation"
import  Notification from "./component/admin/Notification"
import NotificationCenter from "./component/admin/NotificationCenter"
import AdminPage from "./component/admin/AdminPage"
import LeaveCentre from "./component/admin/LeaveCenter"
import LeaveApprovalNotification from "./component/Notifications/LeaveApprovalNotification";
import Navbar from "./component/Dashbaord/Navbar"
import Sidebar from "./component/Dashbaord/Sidebar"
import MainDashboard from "./component/Dashbaord/MainDashboard"





















function App() {
  return (
    <Router>
      <div className="App">

          {/* Routes for dashboards*/}
          <Route path="/navbar" element={<Navbar />} />
           <Route path="/sidebar" element={<Sidebar />} />
             <Route path="/sidebar" element={<MainDashboard />} />
          
        <Routes>
          {/* Route for the main profile form that includes all sections */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/general" element={<MinistryActivity />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/role-selection" element={<RoleSelection />}/> 
          <Route path="/assign" element={<AssignManager />}/> 
          <Route path="/make" element={<MakeManager />}/> 
          <Route path="/addmanager" element={<AddManager />}/>
          <Route path="/addmini" element={<AddMinistryForm />}/>
          <Route path="/adddep" element={<AddDepartment />}/> 
          <Route path="/create" element={<CreateManager />}/> 
          <Route path="/remove-manager" element={<ManageDepartmentManager />}/> 
          <Route path="/unassign-managerdept" element={<UnassignManagerFromDepartments />}/> 
          <Route path="/remove-manager-from-employee" element={<RemoveManagerFromEmployee />}/>
          <Route path="/deletemanager" element={<DeleteManager />}/>
          <Route path="/remove-ministry" element={<RemoveMinistry />}/>
         <Route path="/remove-department" element={<RemoveDepartment />}/>
         <Route path="/cancel-leave" element={<LeaveCancel />}/> 
         <Route path="/leave-status" element={<LeaveStatusTracker />}/>
         <Route path="/on-vacation" element={<OnVacation />}/>
        <Route path="/notifications" element={<Notification />}/>
        <Route path="/notification-centre" element={<NotificationCenter />}/>
         <Route path="/Admin-page" element={<AdminPage />}/>
        <Route path="/leave-centre" element={<LeaveCentre />}/>
        <Route path="/leave-notification" element={<LeaveApprovalNotification/>}/>

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

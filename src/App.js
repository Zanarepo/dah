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
import Recruitment from "./component/MinistriesFunctions/Recruitment"
import Dapartments from "./component/MinistriesFunctions/Departments"
import Ministries from "./component/MinistriesFunctions/Ministries"
import Performance from "./component/MinistriesFunctions/Performance"
import Promotions from "./component/MinistriesFunctions/Promotions"
import Retirement from "./component/MinistriesFunctions/Retirement"
import VerificationExercise from "./component/MinistriesFunctions/VerificationExercise"
import Attendance from "./component/MinistriesFunctions/Attendance"
import Employees from "./component/MinistriesFunctions/Employees"
 import AssignDepartmentAdmin from "./component/admin/AssignDepartmentAdmin"
import LeaveTrackerEducation from "./component/profile/LeaveTrackerEducation"

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
import Notification from "./component/admin/Notification"
import NotificationCenter from "./component/admin/NotificationCenter"
import AdminPage from "./component/admin/AdminPage"
import LeaveCentre from "./component/admin/LeaveCenter"
import LeaveApprovalNotification from "./component/Notifications/LeaveApprovalNotification";
import Navbar from "./component/Dashbaord/Navbar"
import Sidebar from "./component/Dashbaord/Sidebar"
import MainDashboard from "./component/Dashbaord/MainDashboard"
import AdminLayout from "./component/Layout/Layout.js"
import EmployeeTable from "./component/MinistriesFunctions/EmployeeTable"
import EmployeePortal from "./component/Dashbaord/EmployeePortal"

import Analytics from "./component/SuperAdmins/Analytics";
import SuperAdmin from "./component/SuperAdmins/SuperAdmin";
import GeneralDepartments from "./component/SuperAdmins/GeneralDepartments";
import GeneralMinistries from "./component/SuperAdmins/GeneralMinistries"
import GeneralDashboards from "./component/SuperAdmins/GeneralDashboards";
import GeneralSettings from "./component/SuperAdmins/GeneralSettings";

import GeneralAdmins from "./component/SuperAdmins/GeneralAdmins";







function App() {
  return (
    <Router>
      <div className="App">

    {/* Route for the main profile form that includes all sections */}
          
        <Routes>
         


          
       
        <Route path="/g-departsment" element={<GeneralDepartments />} />
          <Route path="/superadmins" element={<SuperAdmin />} />    
          <Route path="/g-settings" element={<GeneralSettings />} />
          <Route path="/g-dashboards" element={<GeneralDashboards />} />
          <Route path="/g-settings" element={<GeneralSettings />} />
          <Route path="/g-admins" element={<GeneralAdmins />} />
          <Route path="/g-ministries" element={<GeneralMinistries />} />
          
          
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/general" element={<MinistryActivity />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/role-selection" element={<RoleSelection />}/> 
          <Route path="/leave-centres" element={<LeaveCentre />}/> 


          {/* Routes for MinistreisFunctions*/}
          <Route path="/performance" element={<AdminLayout> <Performance /></AdminLayout>} />
          <Route path="/promotion" element={<AdminLayout> <Promotions /></AdminLayout>} />
          <Route path="/recruit" element={<AdminLayout> <Recruitment/></AdminLayout>} />
          <Route path="/retire" element={<AdminLayout> <Retirement /></AdminLayout>} />
          <Route path="/verification" element={<AdminLayout> <VerificationExercise /></AdminLayout>} />
          <Route path="/department" element={<AdminLayout> <Dapartments /></AdminLayout>} />
          <Route path="/ministries" element={<AdminLayout> <Ministries /></AdminLayout>} />
          <Route path="/attendance" element={<AdminLayout> <Attendance /></AdminLayout>} />
          <Route path="/employees" element={<AdminLayout> <Employees /></AdminLayout>} />
          <Route path="/make-department-admin" element={<AdminLayout> < AssignDepartmentAdmin /></AdminLayout>} />
          <Route path="/employee-list" element={<AdminLayout> < EmployeeTable /></AdminLayout>} />
          <Route path="/on-vacation" element={<AdminLayout> < OnVacation /></AdminLayout>} />
          <Route path="/leave-notification" element={<AdminLayout> < LeaveApprovalNotification /></AdminLayout>} />
          <Route path="/side" element={<AdminLayout> <side/></AdminLayout>} />
           <Route path="/leave-notification" element={<AdminLayout> < LeaveApprovalNotification /></AdminLayout>} />
          <Route path="/employee-portals" element={<AdminLayout> <EmployeePortal/></AdminLayout>} />
         
        
          {/* Routes for dashboards*/}
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/dashboard" element={<MainDashboard />} />
           {/* Routes for dashboards*/}
          <Route path="/make" element={<AdminLayout> <AssignManager /></AdminLayout>} />
          <Route path="/leave-approval" element={<AdminLayout> <LeaveApproval /></AdminLayout>} />
          <Route path="/leave-centre" element={<AdminLayout> <LeaveCentre /></AdminLayout>} />
          <Route path="/leave-status" element={<AdminLayout> <LeaveStatusTracker /></AdminLayout>} />
          <Route path="/settings" element={<AdminLayout> <Settings /></AdminLayout>} />
          <Route path="/tracks" element={<AdminLayout> <LeaveTrackerEducation /></AdminLayout>} />
          

          <Route path="/Admin-page" element={<AdminLayout> <AdminPage /></AdminLayout>} />


          {/* SUPERADMIN ROUTES */}
          <Route path="/analytics" element={<Analytics />} />
         
          
            {/* Routes for dashboards*/}
          <Route path="/role-selection" element={<RoleSelection />}/> 
          <Route path="/tracks" element={<LeaveTrackerEducation />}/> 
          <Route path="/assign-mgr-emp" element={<MakeManager />}/> 
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
  
       
          <Route path="/reg" element={<RegistrationForm />} />
          <Route path="/activate" element={<ActivateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

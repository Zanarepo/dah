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
import GeneralEmployeesSearch from "./component/SuperAdmins/GeneralEmployeesSearch"
import GeneralVacation from "./component/SuperAdmins/GeneralVacation"
import GeneralEmployeeTable from "./component/SuperAdmins/GeneralEmployeeTable"
import GeneralLeaveApproval from "./component/SuperAdmins/GeneralLeaveApproval"
import GeneralLeaveHistory from "./component/SuperAdmins/GeneralLeaveHistory"
import GeneralLeaveStatus from "./component/SuperAdmins/GeneralLeaveStatus"

import GeneralUpcomingRetiremnt  from "./component/SuperAdmins/GeneralUpcomingRetiremnt"

import GeneralRetirees from "./component/SuperAdmins/GeneralRetirees"

import GeneralGratuityClearance from "./component/SuperAdmins/GeneralGratuityClearance"
import GeneralPendingRetirement from "./component/SuperAdmins/GeneralPendingRetirement"
import GeneralLeaveRequests from "./component/SuperAdmins/GeneralLeaveRequests"
import AssignSuperAdmin from "./component/SuperAdmins/AssignSuperAdmin"
import AssignRole from "./component/SuperAdmins/AssignRole"
import SuperAdminSettings from "./component/SuperAdmins/SuperAdminSettings"
import SuperLayout from "./component/Layout/SuperLayout"
import Analytics from "./component/SuperAdmins/Analytics";
import SuperAdmin from "./component/SuperAdmins/SuperAdmin";
import GeneralDepartments from "./component/SuperAdmins/GeneralDepartments";
import GeneralMinistries from "./component/SuperAdmins/GeneralMinistries"
import GeneralDashboards from "./component/SuperAdmins/GeneralDashboards";
import GeneralSettings from "./component/SuperAdmins/GeneralSettings";

import GeneralAdmins from "./component/SuperAdmins/GeneralAdmins";
import GeneralNotifications from "./component/SuperAdmins/GeneralNotifications"
import Backfunction from "./component/MinistryDashboard/Backfunction.js";


import GeneralEmployeePortal from "./component/SuperAdmins/GeneralEmployeePortal"
//import GeneralNotifications from "./component/SuperAdmins/GeneralNotifications"
//import GeneralNotifications from "./component/SuperAdmins/GeneralNotifications"
import GeneralLeaveCentre from "./component/SuperAdmins/GeneralLeaveCentre"
import DeleteAccess from "./component/SuperAdmins/DeleteAccess"
import RoleAssignmentManagers from "./component/SuperAdmins/RoleAssignmentManagers"
import SuperAdminRoleDashboard from "./component/SuperAdmins/SuperAdminRoleDashboard"
import AddManagerDashboard from "./component/SuperAdmins/AddManagerDashboard"
import  AddMinistryDashboard from "./component/SuperAdmins/AddMinistryDashboard"
import AddDepartmentDashboard from "./component/SuperAdmins/AddDepartmentDashboard"
import MinistryDashboard from "./component/MinistryDashboard/MinistryDashboard"
import MinistryLayout from "./component/Layout/MinistryLayout.js"
import AdminAssignment from "./component/MinistryDashboard/AdminAssignment"

import MinistryDepartments from "./component/MinistryDashboard/MinistryDepartment"
import MinistryList from "./component/MinistryDashboard/MinistryList"
import DepartmentDashboard from "./component/MinistryDashboard/DepartmentDashboard"
import DepartmentList from "./component/MinistryDashboard/DepartmentList"
 import MinistryLeave from "./component/MinistryDashboard/MinistryLeave"
import MinLeaveRequests from "./component/MinistryDashboard/MinLeaveRequests"
import MinLeaveTracker from "./component/MinistryDashboard/MinLeaveTracker"
import MinLeaveApproval from "./component/MinistryDashboard/MinLeaveApproval"
import MinLeaveHistory from "./component/MinistryDashboard/MinLeaveHistory"
import VacationTracker from "./component/MinistryDashboard/VacationTracker"
import MinistryActivities from "./component/MinistryDashboard/MinistryActivities"
import MinRoleAssign from "./component/MinistryDashboard/MinRoleAssign"


import GeneralNotificationCenter from "./component/GeneralNotifications/GeneralNotificationCenter"
import CreateNotice from "./component/GeneralNotifications/CreateNotice"
import Fetch from "./component/GeneralNotifications/Fetch"
import MarkNotice from "./component/GeneralNotifications/MarkNotice"
import EmployeeNotificationCenter from "./component/profile/EmployeeNotificationCenter"
import DepartmentNotification from "./component/admin/DepartmentNotification"
import MinistryAdmin from "./component/MinistryDashboard/MinistryAdmin"
import SuperNotifications from "./component/GeneralNotifications/SuperNotifications"
import MinistryRoleDashboard from "./component/MinistryDashboard/MinistryRoleDashboard"
import MinAssignRole from "./component/MinistryDashboard/MinAssignRole"
import MinDeleteAccess from "./component/MinistryDashboard/MinDeleteAccess"
import MinManagerDashboard from "./component/MinistryDashboard/MinManagerDashboard"
import AddMinManager from "./component/MinistryDashboard/AddMinManager"
import DeleteMinManager from "./component/MinistryDashboard/DeleteMinManager"
import AddMinistryDepartment from "./component/MinistryDashboard/AddMinistryDepartment"
import RemoveMinDepartmement from "./component/MinistryDashboard/RemoveMinDepartmement"
import AddRemMinDashboard from "./component/MinistryDashboard/AddRemMinDashboard"
import AssignAdminsDepartment from "./component/MinistryDashboard/AssignAdminsDepartment"
import MinistryAdmins from "./component/MinistryDashboard/MinistryAdmins"
import SuperVacationTracker from "./component/SuperAdmins/SuperVacationTracker"
import SuperActivities from "./component/SuperAdmins/SuperActivities"
import SuperMinistryDashboard from "./component/SuperAdmins/SuperMinistryDashboard"
import SuperAdminLeave from "./component/SuperAdmins/SuperAdminLeave"
import Layout from "./component/Layout/Layout"
import AdminNotification from "./component/AdminPanel/AdminNotification"
import DepartmentActivities from "./component/AdminPanel/DepartmentActivities"
import DepartmentVacationTracker from "./component/AdminPanel/DepartmentVacationTracker"
import AllDepartmentDashboard from "./component/AdminPanel/AllDepartmentDashboard"
import DepartmentLeave from "./component/AdminPanel/DepartmentLeave"
import DepartmentLeaveRequest from "./component/AdminPanel/DepartmentLeaveRequest"

import DepartmentLeaveDashboard from "./component/AdminPanel/DepartmentLeaveDashboard"
import DeptLeaveRequests from "./component/AdminPanel/DeptLeaveRequests"
import DeptLeaveTracker from "./component/AdminPanel/DeptLeaveTracker"
import DeptLeaveApproval from "./component/AdminPanel/DeptLeaveApproval"
import DeptLeaveHistory from "./component/AdminPanel/DeptLeaveHistory"
import AccessLevelRoles from "./component/AdminPanel/AccessLevelRoles"
import SuperAdminList from "./component/SuperAdmins/SuperAdminList"
import SuperLeaveDashboard from "./component/SuperAdmins/SuperLeaveDashboard"
import SuperLeaveApproval from "./component/SuperAdmins/SuperLeaveApproval"
import SuperLeaveTracker from "./component/SuperAdmins/SuperLeaveTracker"
import SuperLeaveRequests from "./component/SuperAdmins/SuperLeaveRequests"
import SuperLeaveHistory from "./component/SuperAdmins/SuperLeaveHistory"
import MinistryNotification from "./component/GeneralNotifications/MinistryNotification"
import ChatList from "./component/Chat/ChatList"
import ChatBox from "./component/Chat/ChatBox"
import ChatApp from "./component/Chat/ChatApp"
import EmployeeChatBox from "./component/Chat/EmployeeChatBox"
import EmployeeChatApp from "./component/Chat/EmployeeChatApp"
import FileUpload from "./component/Chat/FileUpload"
import ProfileLayout from "./component/profile/ProfileLayout"
import ProfileNotification from "./component/profile/ProfileNotification"
import Chatapp from "./component/profile/Chatapp"
import EmpChatList from "./component/profile/EmpChatList"
import EmpLeave from "./component/profile/EmpLeave"



function App() {
  return (
    <Router>
      <div className="App">

    {/* Route for ADMIN  */}


    <Routes>    
   

    <Route path="/profiles" element={<ProfileLayout />}>

    
    
    </Route>

    </Routes>
    
    <Routes>    
    <Route path="/my-profile" element={<ProfileLayout />}>
    </Route>
  

    <Route path="/" element={<ProfileLayout />}>
    
    <Route path="/personal-details" element={<EmployeePersonalDetails />} />
    <Route path="/employment-details" element={<EmployeeEmploymentDetails />} />
  
    <Route path="/profile-notifications" element={<ProfileNotification />} />
    <Route path="/chatapps" element={<EmployeeChatApp />} />
    <Route path="/empchatlist" element={<EmpChatList />} />
    <Route path="/leave" element={<Leave/>} />
   
    
    
    
    
    </Route>

 </Routes>


 
    <Routes>    
    <Route path="/lay" element={<Layout />}>
    </Route>
  

    <Route path="/" element={<Layout />}>
    <Route path="/admin-notification" element={<AdminNotification />}></Route>
    <Route path="/departactvities" element={<DepartmentActivities/>}></Route>
    <Route path="/department-vacation" element={<DepartmentVacationTracker/>}></Route>
    <Route path="/admindashboard" element={<AllDepartmentDashboard/>}></Route>
    <Route path="/department-leave" element={<DepartmentLeave/>}></Route>
    <Route path="/department-leavereq" element={<DepartmentLeaveRequest/>}></Route>
    <Route path="/dept-leavedashboard" element={<DepartmentLeaveDashboard/>}></Route>
 

    <Route path="/deptleave-requests/:departmentId" element={<DeptLeaveRequests />} />
    <Route path="/deptleave-tracker/:departmentId" element={<DeptLeaveTracker />} />
    <Route path="/deptleave-approval/:departmentId" element={<DeptLeaveApproval />} />
    <Route path="/deptleave-history/:departmentId" element={<DeptLeaveHistory />} />

    </Route>

 </Routes>



        <Routes>
       
        <Route path="/" element={<SuperLayout />}>
        {/* Nested routes under SuperLayout */}
        <Route path="/g-departments" element={<GeneralDepartments />} />
        <Route path="superadmins" element={<SuperAdmin />} />
        <Route path="g-settings" element={<GeneralSettings />} />
        <Route path="g-dashboards" element={<GeneralDashboards />} />
        <Route path="g-admins" element={<GeneralAdmins />} />
        <Route path="g-ministries" element={<GeneralMinistries />} />
        <Route path="g-notifications" element={<GeneralNotifications />} />
        <Route path="super-notification" element={<SuperNotifications />} />
        <Route path="/activity" element={<SuperActivities/>} />
        <Route path="/superVacation" element={<  SuperVacationTracker/>} />
        <Route path="/superministry" element={<SuperMinistryDashboard /> } />
        <Route path="/supervacation" element={<SuperVacationTracker/>} />
        <Route path="/superleave" element={<SuperAdminLeave/>} />
        <Route path="/superlist" element={<SuperAdminList/>} />

        <Route path="/superleave-dashboard" element={<SuperLeaveDashboard/>} />
        <Route path="/superleave-approval" element={<SuperLeaveApproval/>} />
        <Route path="/superleave-tracker" element={<SuperLeaveTracker/>} />
        <Route path="/superleave-requests" element={<SuperLeaveRequests/>} />
        <Route path="/superleave-history" element={<SuperLeaveHistory/>} />
        <Route path="/department-dashboard" element={<DepartmentDashboard/>} />
        <Route path="/chatlist" element={<ChatList/>} />
        <Route path="/chatbox" element={<ChatBox/>} />
        <Route path="/chatapps" element={<ChatApp/>} />
        <Route path="/chatapp" element={<EmployeeChatApp />} />
        
       
    
          
              
           

        {/* Ministry Dashboard*/}
        



  

    {/* SuperAdmins children*/}

          <Route path="/GeneralEmployeesSearch" element={<GeneralEmployeesSearch />} />
          <Route path="/GeneralVacation" element={< GeneralVacation/>} />
          <Route path="/GeneralEmployeeTable" element={<GeneralEmployeeTable />} />
            <Route path="/GeneralLeaveApproval" element={<GeneralLeaveApproval />} />
          <Route path="/GeneralLeaveStatus" element={<GeneralLeaveStatus />} />
          <Route path="/general-roles" element={< AssignRole />} />
            <Route path="/delete-access" element={< DeleteAccess />} />
          <Route path="/GeneralLeaveHistory" element={<GeneralLeaveHistory />} />
          <Route path="/manager-admin" element={<RoleAssignmentManagers />} />

          <Route path="/GeneralVacation" element={< GeneralVacation/>} />
            <Route path="/assigadmin-mindepart" element={< AdminAssignment/>} />

          <Route path="/GeneralUpcomingRetiremnt " element={<GeneralUpcomingRetiremnt  />} />
          <Route path="/access-roles" element={<AccessLevelRoles  />} />
          

          <Route path="/GeneralRetirees" element={<GeneralRetirees />} />
          <Route path="/GeneralPendingRetirement" element={<GeneralPendingRetirement />} />
          <Route path="/GeneralGratuityClearance" element={<GeneralGratuityClearance />} />
          <Route path="/GeneralLeaveRequests" element={<GeneralLeaveRequests />} />
          <Route path="/GeneralEmployeePortal" element={<GeneralEmployeePortal />} />
          <Route path="/GeneralLeaveCentre" element={<GeneralLeaveCentre />} />
          <Route path="/super-admins" element={<SuperAdminSettings />} />
          <Route path="/role-dashboard" element={<SuperAdminRoleDashboard />} />
          <Route path="/addmanager-dashboard" element={<AddManagerDashboard />} />
          <Route path="/addministry-dashboard" element={< AddMinistryDashboard />} />
          <Route path="/adddept-dashboard" element={< AddDepartmentDashboard />} /> 

        </Route>


    {/*---------------------------- Ministry Routes ------------------------------------------------------------------------*/}
        <Route path="/" element={<MinistryLayout />}>
        <Route path="/Back" element={<Backfunction />}></Route> 
        <Route path="/ministry-admins" element={< MinistryAdmin/>}></Route> 
        <Route path="/adminministry" element={<MinistryDashboard /> } 
        />
        <Route path="/ministry-leave" element={<MinistryLeave />} />
        
        <Route path="/mini-departments" element={<MinistryDepartments />} />
        <Route path="/ministry-list" element={<MinistryList />} />
        <Route path="/department-dashboard" element={<DepartmentDashboard />} />
        <Route path="/department-list" element={<DepartmentList />} />
        <Route path="/" element={<MinistryLeave />} />

        <Route path="/minleave-requests/:departmentId" element={<MinLeaveRequests />} />
        <Route path="/minleave-tracker/:departmentId" element={<MinLeaveTracker />} />
        <Route path="/minleave-approval/:departmentId" element={<MinLeaveApproval />} />
        <Route path="/minleave-history/:departmentId" element={<MinLeaveHistory />} />

        <Route path="/minvacation" element={<VacationTracker/>} />
        <Route path="/activities" element={<MinistryActivities/>} />

        <Route path="/general-notification" element={<GeneralNotificationCenter/>} />
        <Route path="/ministy-notification" element={<MinistryNotification/>} />
        
        <Route path="/create-notice" element={<CreateNotice/>} />

        <Route path="/fetch-notification" element={<Fetch/>} />
        <Route path="/mark-notification" element={<MarkNotice/>} />
        <Route path="/minrole-dashboard" element={<MinistryRoleDashboard/>} />
      
        <Route path="/minassign-role" element={<MinAssignRole/>} />
        <Route path="/deleteaccess" element={<   MinDeleteAccess/>} />
        <Route path="/minrole-assign" element={<   MinRoleAssign/>} />
        <Route path="/addmin-manager" element={<   MinManagerDashboard/>} />
        <Route path="/addmanager" element={<   AddMinManager/>} />
        <Route path="/addminidept" element={<   AddMinistryDepartment/>} />
        <Route path="/remove-minidept" element={<   RemoveMinDepartmement/>} /> 
        <Route path="/adremove-minidashboard" element={<   AddRemMinDashboard/>} />
        <Route path="/assignadmin-department" element={<   AssignAdminsDepartment/>} />
        <Route path="/ministryadmins" element={<   MinistryAdmins/>} />

        

        </Route>


{/*---------------------------- Ministry Routes ------------------------------------------------------------------------*/}
    

          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/general" element={<MinistryActivity />} />
          <Route path="/profiles" element={<ProfileForm />} />
          <Route path="/role-selection" element={<RoleSelection />}/> 
          <Route path="/leave-centres" element={<LeaveCentre />}/> 
          <Route path="/create-superadmin" element={<AssignSuperAdmin />}/> 
          <Route path="/profile-notification" element={<EmployeeNotificationCenter />}/> 
          <Route path="/employeechatbox" element={<EmployeeChatBox />}/> 
          <Route path="/employeechatapp" element={<EmployeeChatApp />}/> 
          <Route path="/file" element={<FileUpload />}/> 
          
          

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
          <Route path="/department-alert" element={<AdminLayout> <DepartmentNotification/></AdminLayout>} />
          
         
        
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

      
          <Route path="/History" element={<LeaveHistory />} />
          <Route path="/leave-approval" element={<LeaveApproval />} /> 
          <Route path="/leave-track" element={<LeaveTracking />} />
          <Route path="/count" element={<Countdown />} /> 
          <Route path="/mini" element={<PopulateMinistries />} />
          <Route path="/details" element={<LeaveApprovalDetail />} />

          {/* Routes for each specific section of the profile form */}
         
          
 
          <Route path="/register" element={<EmployeeForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/super-admin" element={<AssignAdminRoles />} />
          <Route path="/empleave" element={<EmpLeave />} />
       
          <Route path="/reg" element={<RegistrationForm />} />
          <Route path="/activate" element={<ActivateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;

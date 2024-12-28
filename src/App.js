import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";







import Backfunction from "./component/MinistryDashboard/Backfunction.js";




import LoginForm from "./component/auth/LoginForm.js";
import RoleSelection from "./component/auth/RoleSelection.js";

import RegistrationForm from "./component/admin/RegistrationForm.js";

import MinistryDashboard from "./component/MinistryDashboard/MinistryDashboard.js"
import MinistryLayout from "./component/Layout/MinistryLayout.js"

import MinistryDepartments from "./component/MinistryDashboard/MinistryDepartment.js"
import MinistryList from "./component/MinistryDashboard/MinistryList.js"

import DepartmentList from "./component/MinistryDashboard/DepartmentList.js"
 import MinistryLeave from "./component/MinistryDashboard/MinistryLeave.js"
import MinLeaveRequests from "./component/MinistryDashboard/MinLeaveRequests.js"
import MinLeaveTracker from "./component/MinistryDashboard/MinLeaveTracker.js"
import MinLeaveApproval from "./component/MinistryDashboard/MinLeaveApproval.js"
import MinLeaveHistory from "./component/MinistryDashboard/MinLeaveHistory.js"
import VacationTracker from "./component/MinistryDashboard/VacationTracker.js"
import MinistryActivities from "./component/MinistryDashboard/MinistryActivities.js"
import MinRoleAssign from "./component/MinistryDashboard/MinRoleAssign.js"




import GeneralEmployeesSearch from "./component/SuperAdmins/GeneralEmployeesSearch.js"
import GeneralVacation from "./component/SuperAdmins/GeneralVacation.js"
import GeneralEmployeeTable from "./component/SuperAdmins/GeneralEmployeeTable.js"
import GeneralLeaveApproval from "./component/SuperAdmins/GeneralLeaveApproval.js"
import GeneralLeaveHistory from "./component/SuperAdmins/GeneralLeaveHistory.js"
import GeneralLeaveStatus from "./component/SuperAdmins/GeneralLeaveStatus.js"
import GeneralUpcomingRetiremnt  from "./component/SuperAdmins/GeneralUpcomingRetiremnt.js"
import GeneralRetirees from "./component/SuperAdmins/GeneralRetirees.js"
import GeneralGratuityClearance from "./component/SuperAdmins/GeneralGratuityClearance.js"
import GeneralPendingRetirement from "./component/SuperAdmins/GeneralPendingRetirement.js"
import GeneralLeaveRequests from "./component/SuperAdmins/GeneralLeaveRequests.js"
import AssignRole from "./component/SuperAdmins/AssignRole.js"
import SuperAdminSettings from "./component/SuperAdmins/SuperAdminSettings.js"
import SuperLayout from "./component/Layout/SuperLayout.js"
import SuperAdmin from "./component/SuperAdmins/SuperAdmin.js";
import GeneralDepartments from "./component/SuperAdmins/GeneralDepartments.js";
import GeneralMinistries from "./component/SuperAdmins/GeneralMinistries.js"
import GeneralDashboards from "./component/SuperAdmins/GeneralDashboards.js";
import GeneralSettings from "./component/SuperAdmins/GeneralSettings.js";
import GeneralAdmins from "./component/SuperAdmins/GeneralAdmins.js";
import GeneralNotifications from "./component/SuperAdmins/GeneralNotifications.js"
import GeneralEmployeePortal from "./component/SuperAdmins/GeneralEmployeePortal.js"
import GeneralLeaveCentre from "./component/SuperAdmins/GeneralLeaveCentre.js"
import DeleteAccess from "./component/SuperAdmins/DeleteAccess.js"
import RoleAssignmentManagers from "./component/SuperAdmins/RoleAssignmentManagers.js"
import SuperAdminRoleDashboard from "./component/SuperAdmins/SuperAdminRoleDashboard.js"
import AddManagerDashboard from "./component/SuperAdmins/AddManagerDashboard.js"
import  AddMinistryDashboard from "./component/SuperAdmins/AddMinistryDashboard.js"
import AddDepartmentDashboard from "./component/SuperAdmins/AddDepartmentDashboard.js"
import AdminAssignment from "./component/MinistryDashboard/AdminAssignment.js"
import DepartmentDashboard from "./component/MinistryDashboard/DepartmentDashboard.js"
import SuperLeaveApproval from "./component/SuperAdmins/SuperLeaveApproval.js"
import SuperLeaveDashboard from "./component/SuperAdmins/SuperLeaveDashboard.js"
import Home from "./component/Home/Home";
import About from "./component/Home/About";
import HomePageLayout from "./component/Home/HomePageLayout";
import ProfileLayout from "./component/profile/ProfileLayout";
import EmployeePersonalDetails from "./component/profile/EmployeePersonalDetails.js";
import EmployeeEmploymentDetails from "./component/profile/EmployeeEmploymentDetails.js";
import ProfileNotification from "./component/admin/Notification";
import EmpChatList from "./component/profile/EmpChatList"
import EmployeeChatApp from "./component/Chat/EmployeeChatApp"

import Leave from "./component/profile/Leave.js";


import SuperLeaveTracker from "./component/SuperAdmins/SuperLeaveTracker.js"
import SuperLeaveRequests from "./component/SuperAdmins/SuperLeaveRequests"

import SuperLeaveHistory from "./component/SuperAdmins/SuperLeaveHistory.js"
import AdminsChatApp from "./component/Chat/AdminsChatApp.js"
import SuperNotifications from "./component/GeneralNotifications/SuperNotifications.js"


import SuperVacationTracker from "./component/SuperAdmins/SuperVacationTracker.js"
import SuperActivities from "./component/SuperAdmins/SuperActivities.js"
import SuperMinistryDashboard from "./component/SuperAdmins/SuperMinistryDashboard.js"
import SuperAdminLeave from "./component/SuperAdmins/SuperAdminLeave.js"


import AccessLevelRoles from "./component/AdminPanel/AccessLevelRoles.js"
import SuperAdminList from "./component/SuperAdmins/SuperAdminList.js"
import AllDepartmentDashboard from "./component/AdminPanel/AllDepartmentDashboard.js"
import DepartmentLeave from "./component/AdminPanel/DepartmentLeave.js"
import DepartmentLeaveRequest from "./component/AdminPanel/DepartmentLeaveRequest.js"
import DepartmentLeaveDashboard from "./component/AdminPanel/DepartmentLeaveDashboard.js"
import DeptLeaveRequests from "./component/AdminPanel/DeptLeaveRequests.js"
import DeptLeaveTracker from "./component/AdminPanel/DeptLeaveTracker.js"


import ChatList from "./component/Chat/ChatList.js"
import ChatBox from "./component/Chat/ChatBox.js"
import DeptLeaveApproval from "./component/AdminPanel/DeptLeaveApproval.js"


import AssignAdminsDepartment from "./component/MinistryDashboard/AssignAdminsDepartment.js"
import Layout from "./component/Layout/Layout.js"
import AdminNotification from "./component/AdminPanel/AdminNotification.js"
import DepartmentActivities from "./component/AdminPanel/DepartmentActivities.js"
import DepartmentVacationTracker from "./component/AdminPanel/DepartmentVacationTracker.js"


import MinDeleteAccess from "./component/MinistryDashboard/MinDeleteAccess.js"
import MinManagerDashboard from "./component/MinistryDashboard/MinManagerDashboard.js"
import AddMinistryDepartment from "./component/MinistryDashboard/AddMinistryDepartment.js"
import AddMinManager from "./component/MinistryDashboard/AddMinManager.js"
import RemoveMinDepartmement from "./component/MinistryDashboard/RemoveMinDepartmement.js"
import AddRemMinDashboard from "./component/MinistryDashboard/AddRemMinDashboard.js"

import DeptLeaveHistory from "./component/AdminPanel/DeptLeaveHistory.js"


import GeneralNotificationCenter from "./component/GeneralNotifications/GeneralNotificationCenter.js"
import MinistryAdmins from "./component/MinistryDashboard/MinistryAdmins.js"
import MinistryNotification from "./component/GeneralNotifications/MinistryNotification.js"
import CreateNotice from "./component/GeneralNotifications/CreateNotice.js"
import Fetch from "./component/GeneralNotifications/Fetch.js"
import MinAssignRole from "./component/MinistryDashboard/MinAssignRole.js"
import MinistryRoleDashboard from "./component/MinistryDashboard/MinistryRoleDashboard.js"
import MinistryAdmin from "./component/MinistryDashboard/MinistryAdmin.js"
import MarkNotice from "./component/GeneralNotifications/MarkNotice.js"
import TodoList from "./component/Productivity/TodoList.js";
import AdminTaskAssignment from "./component/Productivity/AdminTaskAssignment";
import EmployeeTaskManager from "./component/Productivity/EmployeeTaskManager"
//import TaskDashboard from "./component/Productivity/TaskDashboard"
import TaskTracking from "./component/Productivity/TaskTracking"
import  TaskDashboardTracker  from "./component/Productivity/TaskDashboardTracker"
import Notify from "./component/GeneralNotifications/Notify"
import PerformanceDashboard from "./component/Productivity/PerformanceDashboard"
import AdminTaskManagerBoard from "./component/Productivity/AdminTaskManagerBoard"
import EmployeeList from "./component/SuperAdmins/EmployeeList"
import Attendance from "./component/Productivity/Attendance"
import EmployeeAttendance from "./component/Productivity/Attendance"
import AttendanceDashboard from "./component/Productivity/AttendanceDashboard"
import AdminAttendance from "./component/Productivity/AdminAttendance"
import MinistryAttendance from "./component/Productivity/MinistryAttendance"
import DeptAttendance from "./component/Productivity/DeptAttendance"
import AttendanceCalendar from "./component/Productivity/AttendanceCalendar"
import AttendanceMessage from "./component/Productivity/AttendanceMessage"
import CheckInInstructions from "./component/Productivity/CheckInInstructions"
import EmployeeIssueReport from "./component/Productivity/EmployeeIssueReport"
import IssueTracker from "./component/Productivity/IssueTracker"
import Logout from "./component/auth/Logout"
import Settings from "./component/admin/Settings"
import AdminLandingPage from "./component/SuperAdmins/AdminLandingPage"
import ExploreAdminDashboard from "./component/SuperAdmins/ExploreAdminDashboard"
import AdminHomePage from "./component/admin/AdminHomePage"
import ExploreAdmin from "./component/admin/ExploreAdmin"
import MinistryHomePage from "./component/MinistryDashboard/MinistryHomePage"
import ExploreMinistryDashboard from "./component/MinistryDashboard/ExploreMinistryDashboard"
import DisplaySettings from "./component/MinistryDashboard/DisplaySettings"

import MinistrySettings from "./component/MinistryDashboard/MinistrySettings"

import { ThemeProvider } from "./component/ThemeContext";
//import DisplaLayout from "./component/Layout/DisplayLayout.js";
import CreateChannelPage from "./component/Chat/CreateChannelPage.js"
import CreateChannelModal from "./component/Chat/CreateChannelModal"
import EmployeeChatUI from "./component/Chat/EmployeeChatUI"
import ChatAppTesting from "./component/profile/ChatAppTesting"
import DeleteChannelPage from "./component/Chat/DeleteChannelPage"
import ChannelChatBox from "./component/Chat/ChannelChatBox"
import ChannelList from "./component/Chat/ChannelList"
import EmployeeChannelManager from "./component/Chat/EmployeeChannelManager"









const App = () => {
  return (
    <ThemeProvider> 
    <Router>
      <Routes>

         {/* HomePageLayout Routes */}
         <Route path="/" element={<HomePageLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegistrationForm />} />
          <Route path="role-selection" element={<RoleSelection />} />
        


        </Route>

        {/* -------Section 1: Independent Route 2 Profile Layout-----------------*/}
          
          <Route path="" element={<ProfileLayout />}>
          <Route path="/personal-details" element={<EmployeePersonalDetails />} />
          <Route path="/employment-details" element={<EmployeeEmploymentDetails />} />
          <Route path="/profile-notifications" element={<ProfileNotification />} />
          <Route path="/chattings" element={<EmployeeChatApp />} />
          <Route path="/empchatlists" element={<EmpChatList />} />
          <Route path="/leave" element={<Leave/>} />
          <Route path="/todo" element={<TodoList/>} />
          <Route path="/taskmanager" element={<EmployeeTaskManager/>} />
          <Route path="/task-dashboard" element={< TaskDashboardTracker/>} />
          <Route path="/notify" element={< Notify/>} />
          <Route path="/checkin" element={< Attendance/>} />
          <Route path="/employee-checkins" element={< EmployeeAttendance/>} />
           <Route path="/attendance-board" element={< AttendanceDashboard/>} />
           <Route path="/calendar" element={< AttendanceCalendar/>} />
           <Route path="/empchatlist" element={<ChatList/>} />
          <Route path="/chattings" element={<AdminsChatApp />} />
          <Route path="/greetings" element={<AttendanceMessage />} />
          <Route path="/chatting" element={<EmployeeChatApp/>} />
          <Route path="/chatting" element={<CheckInInstructions/>} />
          <Route path="/reports" element={<EmployeeIssueReport/>} />
          <Route path="/logout" element={< Logout/>} /> 
          
       
          

          {/* -------------Section 1: Independent Route 2 Profile Layout-------------------------------*/}
        </Route>

        {/* -------Section 1: Independent Route 2 Profile Layout-----------------*/}
      
        <Route path="/" element={<SuperLayout />}>
        {/* Nested routes under SuperLayout */}
        <Route path="/supertask" element={<AdminTaskAssignment/>} />
        <Route path="/explore" element={<ExploreAdminDashboard/>} />
        <Route path="/delete-channel" element={<DeleteChannelPage/>} />
        
        
        <Route path="/todos" element={<EmployeeTaskManager/>} />
        <Route path="/tasktracking" element={<TaskTracking/>} />
        <Route path="/performance-board" element={<PerformanceDashboard/>} />
        <Route path="/taskboard" element={<AdminTaskManagerBoard/>} />
        <Route path="/generallist" element={<EmployeeList/>} />
        <Route path="/genattendance" element={< Attendance/>} />   {/* this retrievs list of attendance from the databse and populat ina table */}
        <Route path="/gen-checkins" element={< EmployeeAttendance/>} />
        <Route path="/super-attendance" element={< AdminAttendance/>} />    {/* the checking component for sign in and out of the office */}
        <Route path="/issue-tracker" element={< IssueTracker/>} /> 
        <Route path="/settings" element={< Settings/>} /> 
        <Route path="/superhome" element={< AdminLandingPage/>} /> 
        <Route path="/display" element={< DisplaySettings/>} /> 
        
        
        <Route path="/logouts" element={< Logout/>} /> 
        
       


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
        <Route path="/chatss" element={<AdminsChatApp />} />
        <Route path="/chats" element={<EmployeeChatApp/>} />
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
        <Route path="/task" element={<TodoList/>} />
     

      



          {/* -------------Section 1: Independent Route 2 Profile Layout-------------------------------*/}
        </Route>
       
        {/* Section 2: Independent Route 2 */}
        <Route path="/" element={<MinistryLayout />}>
        <Route path="/minitask" element={<AdminTaskAssignment/>} />
        <Route path="/minitrack" element={<TaskTracking/>} />
        <Route path="/ministrytaskboard" element={<AdminTaskManagerBoard/>} />
        <Route path="/ministrieslist" element={<EmployeeList/>} />
        <Route path="/" element={< AdminAttendance/>} />
        <Route path="/ministry-attendance" element={< MinistryAttendance/>} />
         

        <Route path="/Back" element={<Backfunction />}></Route> 
        <Route path="/ministry-admins" element={< MinistryAdmin/>}></Route> 
        <Route path="/adminministry" element={<MinistryDashboard /> } 
        />
        <Route path="/ministry-leave" element={<MinistryLeave />} />
        <Route path="/buzz" element={<EmployeeChatApp />} />

        <Route path="/mini-departments" element={<MinistryDepartments />} />
        <Route path="/ministry-list" element={<MinistryList />} />
        <Route path="/department-dashboard" element={<DepartmentDashboard />} />
        <Route path="/department-lists" element={<DepartmentList />} />
        <Route path="/department-list" element={<ChatList/>} />
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
        <Route path="/ministryhome" element={<   MinistryHomePage/>} />
        <Route path="/explores" element={<   ExploreMinistryDashboard/>} />
         <Route path="/ministrysettings" element={<   MinistrySettings/>} />
         <Route path="/display" element={< DisplaySettings/>} /> 
        
        

        </Route>


      
        {/* Section 3: Independent Route 3 */}
        
        <Route path="" element={<Layout />}>
        <Route path="/gen-checkins" element={< EmployeeAttendance/>} /> 
        <Route path="/admintrack" element={<TaskTracking/>} />
        <Route path="/admin-attendance" element={< AdminAttendance/>} /> 
        <Route path="/dept-attendance" element={<DeptAttendance/>} /> 
        <Route path="/adminhome" element={<AdminHomePage/>} /> 
        <Route path="/onboard" element={<ExploreAdmin/>} /> 


          <Route path="/admin-notification" element={<AdminNotification />}></Route>
          <Route path="/departactvities" element={<DepartmentActivities/>}></Route>
          <Route path="/department-vacation" element={<DepartmentVacationTracker/>}></Route>
          <Route path="/admindashboard" element={<AllDepartmentDashboard/>}></Route>
          <Route path="/department-leave" element={<DepartmentLeave/>}></Route>
          <Route path="/department-leavereq" element={<DepartmentLeaveRequest/>}></Route>
          <Route path="/dept-leavedashboard" element={<DepartmentLeaveDashboard/>}></Route>
          <Route path="/hello" element={<EmployeeChatApp />} />

          <Route path="/deptleave-requests/:departmentId" element={<DeptLeaveRequests />} />
          <Route path="/deptleave-tracker/:departmentId" element={<DeptLeaveTracker />} />
          <Route path="/deptleave-approval/:departmentId" element={<DeptLeaveApproval />} />
          <Route path="/deptleave-history/:departmentId" element={<DeptLeaveHistory />} />
          <Route path="/admintask" element={<AdminTaskAssignment/>} />
          <Route path="/admintaskboard" element={<AdminTaskManagerBoard/>} />
          <Route path="/adminlists" element={<EmployeeList/>} />
          <Route path="/adminlist" element={<ChatList/>} />
          <Route path="/display" element={< DisplaySettings/>} /> 
          <Route path="/signout" element={< Logout/>} /> 
          <Route path="/department-chatpage" element={<CreateChannelPage/>} /> 
        {/*  Section 3: Independent Route 3     <Route path="/creat-channel" element={<CreateChannelModal/>} />  */}  
         {/*  Section 3: Independent Route 3    */} 
       <Route path="/chatui" element={<EmployeeChatUI/>} /> 
        </Route>
        <Route path="/chatest" element={<ChatAppTesting/>} /> 
        <Route path="/chatui" element={<EmployeeChatUI/>} /> 
        <Route path="/create-channel" element={<CreateChannelModal/>} /> 
        <Route path="/deptcreate-channel" element={<CreateChannelPage/>} /> 
        <Route path="/channel-chat" element={<ChannelChatBox/>} /> 
        <Route path="/channelist" element={<ChannelList/>} /> 
        <Route path="/channelmanager" element={<EmployeeChannelManager/>} /> 
        
        
        
        
        















        {/* Optional: 404 Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
    </ThemeProvider> 
  );
};

export default App;

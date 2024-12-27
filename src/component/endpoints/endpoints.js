{/* Routes for Admin and Super Admin */}
<Route path="/notification-centre" element={<NotificationCenter />} />  
{/* Admin tracks all notifications here */}  

<Route path="/Admin-page" element={<AdminPage />} />  
{/* Admin's leave page manager */}  

<Route path="/leave-centre" element={<LeaveCentre />} />  
{/* Admins manage leaves for the department */}  

<Route path="/leave-approval" element={<LeaveApproval />} />  
{/* Admin component to approve leave for a specific department */}  

<Route path="/leave-status" element={<AdminLayout> <LeaveStatusTracker /></AdminLayout>} />  
{/* Component to visualize the entire leave statuses in a department */}  

<Route path="/super-admin" element={<AssignAdminRoles />} />  
{/* Super admins assign admin status to employees */}  

<Route path="/employees" element={<AdminLayout> <Employees /></AdminLayout>} />  
{/* List employees from the selected department */}  

<Route path="/make-department-admin" element={<AdminLayout> <AssignDepartmentAdmin /></AdminLayout>} />  
{/* Retrieve list of departments, select an employee, and make them an admin of that department */}  

<Route path="/employee-list" element={<AdminLayout> <EmployeeTable /></AdminLayout>} />  
{/* Fetch list of all employees in a particular department with their profile info */}  

<Route path="/on-vacation" element={<AdminLayout> <OnVacation /></AdminLayout>} />  
{/* Retrieve list of employees currently on vacation in a specific department */}  

{/* Routes for Dashboards */}
<Route path="/navbar" element={<Navbar />} />  
{/* Navbar component for navigation */}  

<Route path="/sidebar" element={<Sidebar />} />  
{/* Sidebar component for navigation */}  

<Route path="/dashboard" element={<MainDashboard />} />  
{/* Admin dashboard for overall management */}  

<Route path="/make" element={<AdminLayout> <AssignManager /></AdminLayout>} />  
{/* Feature to assign a manager to a department */}  

<Route path="/leave-centre" element={<AdminLayout> <LeaveCentre /></AdminLayout>} />  
{/* Manage and track leaves for the department */}  

<Route path="/assign" element={<AssignManager />} />  
{/* Assigns a manager to a department */}  

<Route path="/make" element={<MakeManager />} />  
{/* Assigns a manager to a specific employee */}  

<Route path="/addmanager" element={<AddManager />} />  
{/* Retrieves a list of employees and adds them to the managers table */}  

<Route path="/addmini" element={<AddMinistryForm />} />  
{/* Allows the admin to add a new ministry to the ministry database */}  

<Route path="/adddep" element={<AddDepartment />} />  
{/* Enables the admin to add a new department to the department database */}  

<Route path="/create" element={<CreateManager />} />  
{/* Similar to /assign, it allows assigning a manager to a department */}  

<Route path="/remove-manager" element={<ManageDepartmentManager />} />  
{/* Removes managers from the ministry. Currently lists managers but does not show managers by department */}  

<Route path="/leave-approval" element={<LeaveApproval />} />  
{/* Enables the admin to approve leave requests from employees */}  

<Route path="/leave-track" element={<LeaveTracking />} />  
{/* Helps the admin track pending, approved, and expired leave requests (not yet functional) */}  

<Route path="/employment-details" element={<EmployeeEmploymentDetails />} />  
{/* Allows the admin to update employees' employment details and assign ministry and department to them */}  



//Employees functions

<Route path="/leave-notification" element={<LeaveApprovalNotification />} />  
{/* Employees track their leave statuses here */}  

<Route path="/reg" element={<RegistrationForm />} />  
{/* Employee registration form */}  

<Route path="/leave" element={<Leave />} />  
{/* Allows employees to apply for leave */}  

<Route path="/History" element={<LeaveHistory />} />  
{/* Displays the leave history of all employees */}  

<Route path="/personal-details" element={<EmployeePersonalDetails />} />  
{/* Allows employees to update their personal profile details */}  

<Route path="/activate" element={<ActivateAccount />} />  
{/* Helps employees activate their accounts (work in progress) */}
/*
import ProfileForm from "./component/profile/ProfileForm.js";
import EmployeeForm from "./component/admin/EmployeeForm.js";
import ActivateAccount from "./component/admin/ActivateAccount.js";
import LeaveHistory from "./component/profile/LeaveHistory.js";

import AssignAdminRoles from "./component/auth/AssignAdminRoles.js";
import AdminPanel from "./component/admin/AdminPanel.js";
import LeaveApproval from "./component/profile/LeaveApproval.js";
import MinistryActivity from "./component/GeneralActivities/MinistryActivity.js";
import Settings from "./component/admin/Settings.js";
import PopulateMinistries from "./component/admin/PopulateMinistries.js";
import ForgotPassword from "./component/auth/ForgotPassword.js";
import Recruitment from "./component/MinistriesFunctions/Recruitment.js"
import Dapartments from "./component/MinistriesFunctions/Departments.js"
import Ministries from "./component/MinistriesFunctions/Ministries.js"
import Performance from "./component/MinistriesFunctions/Performance.js"
import Promotions from "./component/MinistriesFunctions/Promotions.js"
import Retirement from "./component/MinistriesFunctions/Retirement.js"
import VerificationExercise from "./component/MinistriesFunctions/VerificationExercise.js"
import Attendance from "./component/MinistriesFunctions/Attendance.js"
import Employees from "./component/MinistriesFunctions/Employees.js"
import AssignDepartmentAdmin from "./component/admin/AssignDepartmentAdmin.js"
import LeaveTrackerEducation from "./component/profile/LeaveTrackerEducation.js"*/




//import Analytics from "./component/SuperAdmins/Analytics.js";
//import AssignSuperAdmin from "./component/SuperAdmins/AssignSuperAdmin.js"

/*
import LeaveTracking from "./component/auth/LeaveTracking.js"; 
import LeaveApprovalDetail from "./component/auth/LeaveApprovalDetail.js"; 
import AssignManager from "./component/admin/AssignManager.js";
import MakeManager from "./component/admin/MakeManager.js";
import AddManager from "./component/admin/AddManager.js";
import AddMinistryForm from "./component/admin/AddMinistryForm.js";
import AddDepartment from "./component/admin/AddDepartment.js";
import CreateManager from "./component/admin/CreateManager.js";
import ManageDepartmentManager from "./component/admin/ManageDepartmentManager.js";
import UnassignManagerFromDepartments from "./component/admin/UnassignManagerFromDepartments.js"
import RemoveManagerFromEmployee from "./component/admin/RemoveManagerFromEmployee.js"
import DeleteManager from "./component/admin/DeleteManager.js"
import RemoveMinistry  from "./component/admin/RemoveMinistry.js"
import RemoveDepartment from "./component/admin/RemoveDepartment.js"
import LeaveCancel from "./component/profile/LeaveCancel.js"
import LeaveStatusTracker from "./component/profile/LeaveStatusTracker.js"
import OnVacation from "./component/profile/OnVacation.js"
import Notification from "./component/admin/Notification.js"
import NotificationCenter from "./component/admin/NotificationCenter.js"
import AdminPage from "./component/admin/AdminPage.js"
import LeaveCentre from "./component/admin/LeaveCenter.js"
import LeaveApprovalNotification from "./component/Notifications/LeaveApprovalNotification.js";
import Navbar from "./component/Dashbaord/Navbar.js"
import Sidebar from "./component/Dashbaord/Sidebar.js"
import MainDashboard from "./component/Dashbaord/MainDashboard.js"
import AdminLayout from "./component/Layout/Layout.js"
import EmployeeTable from "./component/MinistriesFunctions/EmployeeTable.js"
import EmployeePortal from "./component/Dashbaord/EmployeePortal.js"
import AssignSuperAdmin from "./component/SuperAdmins/AssignSuperAdmin.js"
import Analytics from "./component/SuperAdmins/Analytics.js";

 */
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


import { Route, Routes } from "react-router-dom";
import MinistryLayout from "./MinistryLayout"; // Assuming this is the layout component
import Backfunction from "./Backfunction"; // Import all necessary components
import MinistryAdmin from "./MinistryAdmin";
import MinistryDashboard from "./MinistryDashboard";
import MinistryLeave from "./MinistryLeave";
import EmployeeChatApp from "./EmployeeChatApp";
import MinistryDepartments from "./MinistryDepartments";
import MinistryList from "./MinistryList";
import DepartmentDashboard from "./DepartmentDashboard";
import DepartmentList from "./DepartmentList";
import MinLeaveRequests from "./MinLeaveRequests";
import MinLeaveTracker from "./MinLeaveTracker";
import MinLeaveApproval from "./MinLeaveApproval";
import MinLeaveHistory from "./MinLeaveHistory";
import VacationTracker from "./VacationTracker";
import MinistryActivities from "./MinistryActivities";
import GeneralNotificationCenter from "./GeneralNotificationCenter";
import MinistryNotification from "./MinistryNotification";
import CreateNotice from "./CreateNotice";
import Fetch from "./Fetch";
import MarkNotice from "./MarkNotice";
import MinistryRoleDashboard from "./MinistryRoleDashboard";
import MinAssignRole from "./MinAssignRole";
import MinDeleteAccess from "./MinDeleteAccess";
import MinRoleAssign from "./MinRoleAssign";
import MinManagerDashboard from "./MinManagerDashboard";
import AddMinManager from "./AddMinManager";
import AddMinistryDepartment from "./AddMinistryDepartment";
import RemoveMinDepartmement from "./RemoveMinDepartmement";
import AddRemMinDashboard from "./AddRemMinDashboard";
import AssignAdminsDepartment from "./AssignAdminsDepartment";
import MinistryAdmins from "./MinistryAdmins";

const MinistryRoutes = () => {
  return (
    <Routes>
      {/* Ministry Layout route */}
      <Route path="ministry" element={<MinistryLayout />}>
        {/* Nested Routes under /ministry */}
     
        <Route path="/ministry-admins" element={<MinistryAdmin />} />
        <Route path="/adminministry" element={<MinistryDashboard />} />
        <Route path="/ministry-leave" element={<MinistryLeave />} />
        <Route path="/buzz" element={<EmployeeChatApp />} />
        <Route path="/mini-departments" element={<MinistryDepartments />} />
        <Route path="/ministry-list" element={<MinistryList />} />
        <Route path="/department-dashboard" element={<DepartmentDashboard />} />
        <Route path="/department-list" element={<DepartmentList />} />
        <Route path="/" element={<MinistryLeave />} />
        <Route path="/minleave-requests/:departmentId" element={<MinLeaveRequests />} />
        <Route path="/minleave-tracker/:departmentId" element={<MinLeaveTracker />} />
        <Route path="/minleave-approval/:departmentId" element={<MinLeaveApproval />} />
        <Route path="/minleave-history/:departmentId" element={<MinLeaveHistory />} />
        <Route path="/minvacation" element={<VacationTracker />} />
        <Route path="/activities" element={<MinistryActivities />} />
        <Route path="/general-notification" element={<GeneralNotificationCenter />} />
        <Route path="/ministy-notification" element={<MinistryNotification />} />
        <Route path="/create-notice" element={<CreateNotice />} />
        <Route path="/fetch-notification" element={<Fetch />} />
        <Route path="/mark-notification" element={<MarkNotice />} />
        <Route path="/minrole-dashboard" element={<MinistryRoleDashboard />} />
        <Route path="/minassign-role" element={<MinAssignRole />} />
        <Route path="/deleteaccess" element={<MinDeleteAccess />} />
        <Route path="/minrole-assign" element={<MinRoleAssign />} />
        <Route path="/addmin-manager" element={<MinManagerDashboard />} />
        <Route path="/addmanager" element={<AddMinManager />} />
        <Route path="/addminidept" element={<AddMinistryDepartment />} />
        <Route path="/remove-minidept" element={<RemoveMinDepartmement />} />
        <Route path="/adremove-minidashboard" element={<AddRemMinDashboard />} />
        <Route path="/assignadmin-department" element={<AssignAdminsDepartment />} />
        <Route path="/ministryadmins" element={<MinistryAdmins />} />
      </Route>
    </Routes>
  );
};

export default MinistryRoutes;















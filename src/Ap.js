import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePageLayout from "./component/Home/HomePageLayout";
import ProfileLayout from "./component/profile/ProfileLayout";
//import AdminLayout from "./layouts/AdminLayout";
import MinistryLayout from "./component/Layout/MinistryLayout";
import SuperLayout from "./component/Layout/SuperLayout";

// Example Children Components
import Home from "./component/Home/Home";
import About from "./component/Home/About";
import LoginForm from "./component/auth/LoginForm";
import RegistrationForm from "./component/admin/RegistrationForm";
import EmployeeEmploymentDetails from "./component/profile/EmployeeEmploymentDetails";
import EmployeePersonalDetails from "./component/profile/EmployeePersonalDetails";
//import AdminDashboard from "./pages/AdminDashboard";
import MinistryDashboard from "./component/MinistryDashboard/MinistryDashboard";
import SuperAdmin from "./component/SuperAdmins/SuperAdmin";
import RoleSelection from "./component/auth/RoleSelection";
import Notification from "./component/admin/Notification";

const App = () => {
  return (
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





        {/* Section 1: Independent Route 1 */}
        <Route path="/" element={<ProfileLayout />}>
          <Route path="personal-details" element={<EmployeePersonalDetails />} />
          <Route path="employment-details" element={<EmployeeEmploymentDetails />} />
          <Route path="profile-notifications" element={<ProfileNotification />} />
          <Route path="chatting" element={<EmployeeChatApp />} />
          <Route path="empchatlist" element={<EmpChatList />} />
          <Route path="leave" element={<Leave />} />
          <Route path="my-profile" element={<WelcomeUser />} />
        </Route>

        {/* Section 2: Independent Route 2 */}
        <Route path="/section2" element={<ProfileLayout />}>
          <Route path="personal-details" element={<EmployeePersonalDetails />} />
          <Route path="employment-details" element={<EmployeeEmploymentDetails />} />
          <Route path="profile-notifications" element={<ProfileNotification />} />
          <Route path="chatting" element={<EmployeeChatApp />} />
          <Route path="empchatlist" element={<EmpChatList />} />
          <Route path="leave" element={<Leave />} />
          <Route path="my-profile" element={<WelcomeUser />} />
        </Route>

        {/* Section 3: Independent Route 3 */}
        <Route path="/section3" element={<ProfileLayout />}>
          <Route path="personal-details" element={<EmployeePersonalDetails />} />
          <Route path="employment-details" element={<EmployeeEmploymentDetails />} />
          <Route path="profile-notifications" element={<ProfileNotification />} />
          <Route path="chatting" element={<EmployeeChatApp />} />
          <Route path="empchatlist" element={<EmpChatList />} />
          <Route path="leave" element={<Leave />} />
          <Route path="my-profile" element={<WelcomeUser />} />
        </Route>

        {/* Section 4: Independent Route 4 */}
        <Route path="/" element={<ProfileLayout />}>
          <Route path="personal-details" element={<EmployeePersonalDetails />} />
          <Route path="employment-details" element={<EmployeeEmploymentDetails />} />
          <Route path="profile-notifications" element={<ProfileNotification />} />
          <Route path="chatting" element={<EmployeeChatApp />} />
          <Route path="empchatlist" element={<EmpChatList />} />
          <Route path="leave" element={<Leave />} />
          <Route path="my-profile" element={<WelcomeUser />} />
        </Route>

        {/* Optional: 404 Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;

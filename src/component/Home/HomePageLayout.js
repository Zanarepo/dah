import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import About from "./About";

import RegistrationForm from "../admin/RegistrationForm";
import LoginForm from "../auth/LoginForm";
import RoleSelection from "../auth/RoleSelection";
import  Notifications from "../admin/Notification";

const HomePageLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content (Dynamically Rendered Based on Routes) */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/role-selection" element={<RoleSelection />} />
        
          <Route path="/notifications" element={<Notifications/>} />
          
          
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePageLayout;

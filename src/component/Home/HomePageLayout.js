import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import About from "./About";
import RegistrationForm from "../admin/RegistrationForm";
import LoginForm from "../auth/LoginForm";
import RoleSelection from "../auth/RoleSelection";

const HomePageLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content (Dynamically Rendered Based on Routes) */}
      <div className="flex-1 mt-16 sm:mt-20 px-4 sm:px-6 md:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/role-selection" element={<RoleSelection />} />
       
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePageLayout;

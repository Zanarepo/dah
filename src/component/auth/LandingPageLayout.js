import React, { useState } from "react";
import LoginForm from "./LoginForm";  // Import LoginForm component
import EmployeeRegistrationForm from "../admin/RegistrationForm"; // Import EmployeeRegistrationForm component

const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false); // Close registration form if it's open
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false); // Close login form if it's open
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="text-center max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Welcome to Our Platform</h1>
        
        <div className="mb-4">
          <button 
            onClick={openLogin} 
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
          >
            Login
          </button>
          <button 
            onClick={openRegister} 
            className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Sign Up
          </button>
        </div>

        {/* Show the Login or Register form based on state */}
        {isLoginOpen && <LoginForm />}
        {isRegisterOpen && <EmployeeRegistrationForm />}
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";  // Import LoginForm component
import EmployeeRegistrationForm from "../admin/RegistrationForm";  // Import EmployeeRegistrationForm component

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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">Brand</div>
          <div className="space-x-4">
            <Link
              to="/"
              className="text-white hover:text-gray-300"
            >
              Home
            </Link>
            <button
              onClick={openLogin}
              className="text-white hover:text-gray-300"
            >
              Login
            </button>
            <button
              onClick={openRegister}
              className="text-white hover:text-gray-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Main Landing Content */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="text-center max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          {/* Display Welcome Message when no form is open */}
          {!isLoginOpen && !isRegisterOpen && (
            <>
              <h1 className="text-3xl font-bold text-gray-700 mb-6">Welcome to Our Platform</h1>
              <p className="text-lg text-gray-500">We are glad to have you here!</p>
            </>
          )}

          {/* Render Login Form */}
          {isLoginOpen && <LoginForm />}

          {/* Render Register Form */}
          {isRegisterOpen && <EmployeeRegistrationForm />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

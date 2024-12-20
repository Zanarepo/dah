import React from "react";
import { useNavigate } from "react-router-dom"; // Importing the useNavigate hook for routing

const CallToAction = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleGetStarted = () => {
    navigate("/register"); // Redirect to the login page
  };

  return (
    <section className="call-to-action bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 md:p-12 text-center rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
        Ready to Transform Your Workforce?
      </h2>
      <p className="mt-4 text-base sm:text-lg md:text-xl leading-relaxed">
        Join the Datafy platform today and unlock efficiency, transparency, and insights for your organization.
      </p>
      <div className="mt-6">
        <button
          onClick={handleGetStarted} // Added onClick handler to trigger navigation
          className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default CallToAction;

import React, { useEffect, useState } from "react";

const WelcomeUser = ({ name }) => {
  const [greeting, setGreeting] = useState("");
  const [showWelcome, setShowWelcome] = useState(false); // State to control visibility

  useEffect(() => {
    // Check if the user has seen the welcome message before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");

    // If the user hasn't seen the welcome message, show it
    if (!hasSeenWelcome) {
      setShowWelcome(true);

      // Mark the user as having seen the welcome message
      localStorage.setItem("hasSeenWelcome", "true");

      // Hide the welcome message after 5 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000); // 5 seconds timeout
    }

    // Determine the current time and set the greeting
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []); // Empty dependency array to run only once on mount

  const handleContinue = () => {
    setShowWelcome(false); // Hide the welcome component when Continue is clicked
  };

  return (
    <>
      {/* Conditional rendering of the WelcomeUser component */}
      {showWelcome && (
        <div
          className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
          style={{
            backgroundImage: "url('image/Background1.jpg')", // Set background image from /public/images folder
          }}
        >
          <div className="max-w-md w-full bg-white shadow-2xl rounded-lg p-8 text-center transform transition-all duration-500 ease-in-out scale-100 hover:scale-105">
            <h1 className="text-4xl font-extrabold text-gray-800">
              {greeting}, <span className="text-blue-600">{name || "Guest"}</span>!
            </h1>
            <p className="mt-4 text-gray-600 text-lg font-medium">
              We’re thrilled to have you here. Let’s make today amazing together!
            </p>
            <img
              src="/images/welcome.jpg" // Add your welcome illustration from the public/images folder
              alt="Welcome and do have a great time here"
              className="w-full max-w-xs mx-auto mt-6 transform transition-all duration-500 ease-in-out opacity-80 hover:opacity-100"
            />
            {/* Continue Button */}
            <button
              onClick={handleContinue} // Trigger hiding the component when clicked
              className="mt-6 px-8 py-3 bg-green-600 rounded-lg text-white font-semibold hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomeUser;

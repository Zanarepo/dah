import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid"; // Import the back arrow icon from heroicons

const BackFunction = () => {
  const navigate = useNavigate(); // useNavigate from react-router-dom to navigate

  // Function to navigate back to the previous page or a specific route
  const goBack = () => {
    navigate(-1); // This will navigate to the previous page in history
  };

  return (
    <button
      onClick={goBack}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "white", // White background
        border: "none",
        cursor: "pointer",
        padding: "8px",
        marginBottom: "16px", // Space below the button
      }}
    >
      <ArrowLeftIcon style={{ width: "20px", height: "20px", marginRight: "8px", color: "#000" }} /> {/* Back arrow icon */}
      <span style={{ fontSize: "14px", color: "#000" }}>Back</span> {/* Label text */}
    </button>
  );
};

export default BackFunction;

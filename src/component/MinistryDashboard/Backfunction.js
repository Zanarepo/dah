import React from "react";
import { useNavigate } from "react-router-dom";

const Backfunction = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-blue-500 hover:text-blue-700 transition duration-300"
    >
      &larr; Back
    </button>
  );
};

export default Backfunction;

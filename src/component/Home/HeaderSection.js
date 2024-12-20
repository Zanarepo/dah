import React from "react";

const HeaderSection = () => {
  return (
    <header className="header-section bg-blue-500 text-white p-8 text-center mt-16">
      <h1 className="text-4xl font-bold">Welcome to Datafy</h1>
      <p className="mt-4 text-lg">
        Empowering government organizations to manage workforce efficiently.
      </p>
      <div className="mt-6">
        <button className="px-6 py-2 bg-white text-blue-500 font-bold rounded">
          Learn More
        </button>
      </div>
    </header>
  );
};

export default HeaderSection;

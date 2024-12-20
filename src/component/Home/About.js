import React from "react";

const About = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-6 sm:px-12 md:px-20 lg:px-40">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-purple-800 sm:text-6xl">About Us</h1>
        <p className="text-lg text-purple-600 mt-4 max-w-2xl mx-auto">
          Discover our mission, values, and the people who make it happen.
        </p>
      </div>

      {/* Mission and Values Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 lg:p-16 mb-12">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          At our core, we strive to empower individuals and organizations by providing
          cutting-edge solutions tailored to their needs. Our mission is to foster growth,
          innovation, and collaboration in every community we serve.
        </p>

        <h2 className="text-3xl font-bold text-blue-700 mb-6">Our Values</h2>
        <ul className="list-disc list-inside space-y-4 text-gray-700">
          <li><span className="font-semibold text-purple-700">Integrity:</span> We uphold the highest standards of honesty and accountability.</li>
          <li><span className="font-semibold text-purple-700">Innovation:</span> We constantly seek new ways to solve challenges.</li>
          <li><span className="font-semibold text-purple-700">Collaboration:</span> We believe in the power of teamwork and partnerships.</li>
          <li><span className="font-semibold text-purple-700">Excellence:</span> We aim to deliver top-quality services and products.</li>
        </ul>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 py-12 px-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-purple-800 mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">John Doe</h3>
              <p className="text-gray-600">Position</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="mt-12">
        <img
          src="https://via.placeholder.com/1200x600"
          alt="About Us"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default About;

import React from "react";
import { FaCogs, FaUsers, FaChartLine, FaBullhorn } from "react-icons/fa";

const WhyDatafy = () => {
  return (
    <div className="why-datafy-container bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Why Datafy?</h2>
        <p className="text-xl text-gray-600 mt-4">
          Revolutionizing government ministries for a more efficient, transparent, and fulfilling future.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Efficiency */}
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <FaCogs className="text-blue-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Efficiency</h3>
          <p className="text-gray-600">
            Streamline operations and reduce bureaucratic delays, making workflows faster and more efficient.
          </p>
        </div>

        {/* Transparency */}
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <FaBullhorn className="text-yellow-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Transparency</h3>
          <p className="text-gray-600">
            Enhance communication and transparency in all processes to improve trust and accountability.
          </p>
        </div>

        {/* Employee Performance */}
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <FaUsers className="text-green-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Employee Performance</h3>
          <p className="text-gray-600">
            Empower employees with the right tools to boost performance and create a positive work culture.
          </p>
        </div>

        {/* Resourcefulness */}
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <FaChartLine className="text-purple-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Resourcefulness</h3>
          <p className="text-gray-600">
            Maximize resources and drive innovation to create a more effective and resourceful government.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600">
          With Datafy, we&apos;re not just transforming processes—we&apos;re reshaping how governments can work, leading to a brighter, more efficient workforce       </p>
      </div>
    </div>
  );
};

export default WhyDatafy;

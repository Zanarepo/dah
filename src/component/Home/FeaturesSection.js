import React from "react";
import { FaCalendarAlt } from "react-icons/fa"; // Importing the calendar icon

const features = [
  {
    title: "Leave Management",
    description: "Track employee leave requests across departments.",
    icon: <FaCalendarAlt className="text-4xl text-blue-600" />, // Using the calendar icon with consistent styling
  },
  {
    title: "BuzzMe Chat App",
    description: "Enable secure and efficient work communication.",
    icon: "💬",
  },
  {
    title: "Notifications & Reminders",
    description: "Stay informed about pending tasks and deadlines.",
    icon: "🔔",
  },
  {
    title: "Employee Records",
    description: "Centralized documentation of employees' data.",
    icon: "📁",
  },
  {
    title: "Analytics Dashboard",
    description: "Gain insights into workforce metrics and trends.",
    icon: "📊",
  },
  {
    title: "Access Role Management",
    description: "Restrict access to sensitive data based on user roles, ensuring that ministries and departments only access relevant information.",
    icon: "🔒",
  },
  {
    title: "General Channel",
    description: "A common platform for easy and fast information delivery across all departments and ministries.",
    icon: "📢",
  },
];

const FeaturesSection = () => {
  return (
    <section className="features-section p-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Key Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-6 rounded-lg text-center duration-300 ease-in-out"
          >
            <div className="flex justify-center items-center text-4xl mb-4"> 
              {feature.icon}
            </div> {/* Ensures icons are centered */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

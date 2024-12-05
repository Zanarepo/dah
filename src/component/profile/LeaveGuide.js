import React from "react";

const LeaveGuide = () => {
  const steps = [
    {
      title: "Step 1",
      description:
        "Receive a notification in the Admin Center about the leave request. It will display the employee's name, leave type, and status.",
    },
    {
      title: "Step 2",
      description:
        "Go to the Leave Center. Here, you'll find all requests listed with detailed information.",
    },
    {
      title: "Step 3",
      description:
        "Click on a request to view more details about the leave, including start and end dates.",
    },
    {
      title: "Step 4",
      description:
        "Approve or reject the request. The employee will be notified of the decision automatically.",
    },
    {
      title: "Final Step",
      description: "That's it! The process is straightforward and efficient.",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Leave Approval Guide
      </h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="p-4 bg-blue-100 rounded-lg border border-blue-300"
          >
            <h3 className="text-lg font-bold text-blue-800">{step.title}</h3>
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveGuide;

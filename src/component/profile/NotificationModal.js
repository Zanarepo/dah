import React, { useEffect } from "react";

const NotificationModal = ({ message, type, onClose }) => {
  useEffect(() => {
    // Automatically close the modal after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className={`text-xl font-semibold text-center ${type === "error" ? "text-red-500" : "text-green-500"}`}>
          {type === "error" ? "Error" : "Success"}
        </h2>
        <p className="text-center mt-4">{message}</p>
        {/* Optional Close button */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

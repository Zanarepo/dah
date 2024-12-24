import React, { useState } from 'react';

const CheckInInstructions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full text-center mb-4 px-4">
      <p className="text-lg text-gray-700 mb-2">
        Before you begin,{' '}
        <button
          onClick={openModal}
          className="text-blue-500 font-semibold hover:text-blue-600 focus:outline-none"
        >
          click here for instructions
        </button>
      </p>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 relative p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal when inside
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 font-bold text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-left text-blue-700 mb-4">
              Check-In Instructions
            </h2>

            <div className="text-lg text-gray-700 space-y-4">
              {/* Instruction Tile 1 */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl text-blue-700">1</span>
                  </div>
                  <p className="flex-1">
                    When you click on the &quot;Check-In&quot; link for the first time, you will be prompted to allow access to your location. Please click &quot;Allow&quot;.
                  </p>
                </div>
              </div>

              {/* Instruction Tile 2 */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl text-blue-700">2</span>
                  </div>
                  <p className="flex-1">
                    It is important that you are within the work premises for this to work successfully. You will be notified if you are outside the premises.
                  </p>
                </div>
              </div>

              {/* Instruction Tile 3 */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl text-blue-700">3</span>
                  </div>
                  <p className="flex-1">
                    Once your location is verified, you will receive a notification of a successful check-in.
                  </p>
                </div>
              </div>

              {/* Instruction Tile 4 */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl text-blue-700">4</span>
                  </div>
                  <p className="flex-1">
                    Always remember to check out at the end of the day to avoid being marked as absent.
                  </p>
                </div>
              </div>

              {/* Instruction Tile 5 */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl text-blue-700">5</span>
                  </div>
                  <p className="flex-1">
                    If you encounter any issues, log the issue into the report sheet for record purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInInstructions;

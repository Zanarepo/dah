import React, { useState, Suspense, lazy } from 'react';

// Lazy loading the components
const AddEmployeesChannel = lazy(() => import('./AddEmployeesChannel'));
const RemoveEmployeesChannel = lazy(() => import('./RemoveEmployeesChannel'));

const Dashboard = () => {
  const [selectedAction, setSelectedAction] = useState('add'); // To toggle between add/remove actions
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal by updating state
  };

  // Open modal function
  const openModal = () => {
    setIsModalOpen(true); // Open the modal by updating state
  };

  return (
    <div className="container mx-auto p-4">
      {/* Center the main header */}
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Channel Members</h1>

      {/* Action Selector */}
      <div className="mb-4">
        <label className="block mb-2 text-center"></label>
        <div className="flex justify-center space-x-4">
          <button
            className={`py-2 px-4 rounded ${selectedAction === 'add' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setSelectedAction('add')}
          >
            Add Members
          </button>
          <button
            className={`py-2 px-4 rounded ${selectedAction === 'remove' ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setSelectedAction('remove')}
          >
            Remove Members
          </button>
        </div>
      </div>

      {/* Suspense to handle lazy-loaded components */}
      <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
        {selectedAction === 'add' ? (
          <AddEmployeesChannel openModal={openModal} closeModal={closeModal} />
        ) : (
          <RemoveEmployeesChannel openModal={openModal} closeModal={closeModal} />
        )}
      </Suspense>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96 relative">
            <p>Modal Content Here</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md absolute top-2 right-2"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, Suspense, lazy } from 'react';

// Lazy loading the components
const CreateChannel = lazy(() => import('../Chat/CreateChannel'));
const DeleteChannelPage = lazy(() => import('../Chat/DeleteChannelPage'));

const ChannelDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">Channel Management </h1>

      {/* Tabs to switch between Create and Delete Channel */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`py-2 px-6 rounded-lg ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} // Increased padding for spacing
          onClick={() => setActiveTab('create')}
        >
          Create Channel
        </button>
        <button
          className={`py-2 px-6 rounded-lg ${activeTab === 'delete' ? 'bg-red-500 text-white' : 'bg-gray-200'}`} // Increased padding for spacing
          onClick={() => setActiveTab('delete')}
        >
          Delete Channel
        </button>
      </div>

      {/* Render the active tab content */}
      <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
        {activeTab === 'create' && <CreateChannel />}
        {activeTab === 'delete' && <DeleteChannelPage />}
      </Suspense>
    </div>
  );
};

export default ChannelDashboard;

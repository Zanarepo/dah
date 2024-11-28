import React, { useState } from 'react';

const AdminAccountCreation = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    temporaryPassword: '',
    whatsappNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Admin account creation data:', formData);
    // Add logic to create employee account in Supabase
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Employee Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input name="temporaryPassword" value={formData.temporaryPassword} onChange={handleChange} placeholder="Temporary Password" required />
        <input name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="WhatsApp Number (Optional)" />
        <button type="submit" className="btn-primary">Create Account</button>
      </form>
    </div>
  );
};

export default AdminAccountCreation;

import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const InsertEmployee = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [staffId, setStaffId] = useState('');
  const [lgaOfOrigin, setLgaOfOrigin] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            address: address,
            staff_id: staffId,
            lga_of_origin: lgaOfOrigin,
            email: email,
          },
        ]);

      if (error) throw error;

      setSuccessMessage('Employee added successfully!');
      // Reset form fields after successful insert
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setAddress('');
      setStaffId('');
      setLgaOfOrigin('');
      setEmail('');
    } catch (err) {
      setError('Failed to insert employee record.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Insert New Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="LGA of Origin"
          value={lgaOfOrigin}
          onChange={(e) => setLgaOfOrigin(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add Employee</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
    </div>
  );
};

export default InsertEmployee;

import React, { useState } from 'react';

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data submitted:', loginData);
    // Add logic to handle login with Supabase
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" value={loginData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={loginData.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;

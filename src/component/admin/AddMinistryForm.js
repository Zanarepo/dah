import React, { useState } from "react";
import { supabase } from "../../supabaseClient";// Adjust the import path based on your project structure

const AddMinistryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    admin_id: "",
    contact_email: "",
    contact_phone: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const { data, error } = await supabase.from("ministries").insert([formData]);
      if (error) throw error;

      setSuccessMessage("Ministry added successfully!");
      setFormData({ name: "", admin_id: "", contact_email: "", contact_phone: "" });
    } catch (error) {
      setErrorMessage("Error adding ministry: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Ministry</h2>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Ministry Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Admin ID</label>
          <input
            type="text"
            name="admin_id"
            value={formData.admin_id}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Email (required)</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Phone (required)</label>
          <input
            type="text"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Add Ministry
        </button>
      </form>
    </div>
  );
};

export default AddMinistryForm;
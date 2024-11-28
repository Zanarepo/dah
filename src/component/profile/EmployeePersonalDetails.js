import React, { useState } from "react";

const EmployeePersonalDetails = ({ employeeData, setEmployeeData }) => {
  const [avatar, setAvatar] = useState(employeeData.avatar || null);
  const [isEditable, setIsEditable] = useState(false); // Track if the form is in edit mode

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle avatar image upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);

      setEmployeeData((prevData) => ({
        ...prevData,
        avatar: imageUrl, // Update avatar
      }));
    }
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Avatar Section */}
        <div className="col-span-2">
          <label htmlFor="avatar" className="block text-sm font-medium">Profile Picture</label>
          <div className="flex items-center mt-2">
            <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-gray-400">No Image</span>
              )}
            </div>
            {isEditable && (
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleAvatarChange}
                className="ml-4 p-2 border border-gray-300 rounded"
              />
            )}
          </div>
        </div>

        {/* Other Input Fields */}
        {["employee_id", "first_name", "last_name", "date_of_birth", "email", "phone_number", "address", "marital_status", "sex", "nationality", "state_of_origin", "lga_of_origin"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium">
              {field.replace(/_/g, " ").toUpperCase()}
            </label>
            <input
              type={field === "date_of_birth" ? "date" : "text"}
              id={field}
              name={field}
              value={employeeData[field]}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              disabled={!isEditable} // Disable input if not in edit mode
            />
          </div>
        ))}

        {/* Marital Status and Sex dropdown */}
        <div>
          <label htmlFor="marital_status" className="block text-sm font-medium">Marital Status</label>
          <select
            id="marital_status"
            name="marital_status"
            value={employeeData.marital_status}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            disabled={!isEditable}
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
          </select>
        </div>

        <div>
          <label htmlFor="sex" className="block text-sm font-medium">Sex</label>
          <select
            id="sex"
            name="sex"
            value={employeeData.sex}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            disabled={!isEditable}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

      </div>

      {/* Edit Button */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleEditClick}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {isEditable ? "Save Changes" : "Edit Details"}
        </button>
      </div>
    </div>
  );
};

export default EmployeePersonalDetails;

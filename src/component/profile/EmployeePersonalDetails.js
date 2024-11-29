import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Ensure you have Supabase client initialized

const EmployeePersonalDetails = ({ employeeData, setEmployeeData }) => {
  const [profilePicture, setProfilePicture] = useState(employeeData.profile_picture || null);
  const [isEditable, setIsEditable] = useState(false);
  const [error, setError] = useState(""); // Error message state
  const [success, setSuccess] = useState(""); // Success message state

  // Load data from localStorage if available
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("employeeData"));
    if (storedData) {
      setEmployeeData(storedData);
      setProfilePicture(storedData.profile_picture || null);
    }
  }, [setEmployeeData]);

  // Save data to localStorage
  useEffect(() => {
    if (employeeData) {
      localStorage.setItem("employeeData", JSON.stringify(employeeData));
    }
  }, [employeeData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload the file to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("Images") // Ensure the bucket name matches
          .upload(fileName, file);
  
        if (uploadError) {
          throw uploadError;
        }
  
        // Get the public URL of the uploaded image
        const { data: publicURLData, error: urlError } = supabase.storage
          .from("Images")
          .getPublicUrl(fileName);
  
        if (urlError) {
          throw urlError;
        }
  
        const publicURL = publicURLData.publicUrl;
  
        // Update profile picture in the database
        const { data: updateData, error: updateError } = await supabase
          .from("employees") // Replace with your actual table name
          .update({ profile_picture: publicURL })
          .eq("id", employeeData.id); // Ensure the correct user ID is used
  
        if (updateError) {
          throw updateError;
        }
  
        // Update the local state
        setProfilePicture(publicURL);
        setEmployeeData((prevData) => ({
          ...prevData,
          profile_picture: publicURL,
        }));
  
        setSuccess("Profile picture updated successfully!");
        setError("");
      } catch (error) {
        setError("Failed to upload profile picture: " + error.message);
        setSuccess("");
      }
    }
  };
  
  // Toggle edit mode and validate before saving
  const handleEditClick = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      // Validate fields when saving
      if (!employeeData.first_name || !employeeData.last_name) {
        setError("First Name and Last Name are required!");
        setSuccess(""); // Clear success if validation fails
      } else {
        setError(""); // Clear error if validation passes
        setSuccess("Profile updated successfully!"); // Show success message
      }
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Profile Picture Section */}
        <div className="col-span-2">
          <label htmlFor="profile_picture" className="block text-sm font-medium">
            Profile Picture
          </label>
          <div className="flex items-center mt-2">
            <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </span>
              )}
            </div>
            {isEditable && (
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                onChange={handleProfilePictureChange}
                className="ml-4 p-2 border border-gray-300 rounded"
              />
            )}
          </div>
        </div>

        {/* Other Input Fields */}
        {["employee_id", "first_name", "last_name", "date_of_birth", "email", "phone_number", "address", "nationality", "state_of_origin", "lga_of_origin"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium">
              {field.replace(/_/g, " ").toUpperCase()}
            </label>
            <input
              type={field === "date_of_birth" ? "date" : "text"}
              id={field}
              name={field}
              value={employeeData[field] || ""} // Controlled value
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              disabled={!isEditable} // Disable input if not in edit mode
            />
          </div>
        ))}

        {/* Marital Status Dropdown */}
        <div>
          <label htmlFor="marital_status" className="block text-sm font-medium">
            Marital Status
          </label>
          <select
            id="marital_status"
            name="marital_status"
            value={employeeData.marital_status || ""}
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

        {/* Sex Dropdown */}
        <div>
          <label htmlFor="sex" className="block text-sm font-medium">
            Sex
          </label>
          <select
            id="sex"
            name="sex"
            value={employeeData.sex || ""}
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

      {/* Error and Success Display */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}

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

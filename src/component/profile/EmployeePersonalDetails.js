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
          throw new Error("Failed to upload file: " + uploadError.message);
        }

        // Get the public URL of the uploaded image
        const { data: publicURLData, error: urlError } = supabase.storage
          .from("Images")
          .getPublicUrl(fileName);

        if (urlError) {
          throw new Error("Failed to retrieve file URL: " + urlError.message);
        }

        const publicURL = publicURLData.publicUrl;

        // Update profile picture in the database
        const { data: updateData, error: updateError } = await supabase
          .from("employee_profiles") // Correct table name
          .update({ profile_picture: publicURL })
          .eq("id", employeeData.id); // Ensure the correct user ID is used

        if (updateError) {
          throw new Error("Failed to update the database: " + updateError.message);
        }

        // Update the local state and display success message
        setProfilePicture(publicURL);
        setEmployeeData((prevData) => ({
          ...prevData,
          profile_picture: publicURL,
        }));
        localStorage.setItem(
          "employeeData",
          JSON.stringify({ ...employeeData, profile_picture: publicURL })
        );
        setSuccess("Profile picture updated successfully!");
        setError("");
      } catch (error) {
        setError(error.message);
        setSuccess("");
      }
    }
  };

  // Handle save changes and update data in Supabase
  const handleSaveChanges = async () => {
    try {
      // Validate fields before saving
      if (!employeeData.first_name || !employeeData.last_name) {
        setError("First Name and Last Name are required!");
        setSuccess(""); // Clear success if validation fails
        return;
      }

      // Update employee profile in Supabase
      const { data, error } = await supabase
        .from("employee_profiles") // Ensure correct table name
        .update({
          first_name: employeeData.first_name,
          last_name: employeeData.last_name,
          date_of_birth: employeeData.date_of_birth,
          email: employeeData.email,
          phone_number: employeeData.phone_number,
          address: employeeData.address,
          nationality: employeeData.nationality,
          state_of_origin: employeeData.state_of_origin,
          lga_of_origin: employeeData.lga_of_origin,
          marital_status: employeeData.marital_status,
          sex: employeeData.sex,
          profile_picture: profilePicture,
        })
        .eq("id", employeeData.id); // Ensure to use the correct employee ID

      if (error) {
        throw new Error("Failed to update the database: " + error.message);
      }

      // Update localStorage with the new data
      localStorage.setItem("employeeData", JSON.stringify(employeeData));

      // Set success message
      setSuccess("Profile updated successfully!");
      setError(""); // Clear error message if save is successful
    } catch (error) {
      setError(error.message);
      setSuccess(""); // Clear success if there is an error
    }
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      // If exiting edit mode, save changes
      handleSaveChanges();
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
      <div className="mt-4">
        <button
          onClick={handleEditClick}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditable ? "Save Changes" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default EmployeePersonalDetails;

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeePersonalDetails = ({ employeeData, setEmployeeData }) => {
  const [profilePicture, setProfilePicture] = useState(employeeData?.profile_picture || null);
  const [isEditable, setIsEditable] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const [temporaryImage, setTemporaryImage] = useState(null); // For image preview
 // For image preview

  // Load employee data from localStorage on initial render
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("employeeData"));
    if (storedData) {
      setEmployeeData(storedData);
      setProfilePicture(storedData.profile_picture || null);
    }
  }, [setEmployeeData]);

  // Sync employee data to localStorage whenever it updates
  useEffect(() => {
    if (employeeData) {
      localStorage.setItem("employeeData", JSON.stringify(employeeData));
    }
  }, [employeeData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  // Handle profile picture upload with preview
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true); // Start uploading process
      setTemporaryImage(URL.createObjectURL(file)); // Show preview of the image immediately

      try {
        const fileName = `${Date.now()}-${file.name}`;
        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from("Images")
          .upload(fileName, file);

        if (uploadError) throw new Error("Failed to upload image.");

        const { data: publicURLData, error: urlError } = supabase.storage
          .from("Images")
          .getPublicUrl(fileName);

        if (urlError) throw new Error("Failed to fetch image URL.");

        const publicURL = publicURLData.publicUrl;

        // Update the profile picture URL in the employee profile
        const { error: updateError } = await supabase
          .from("employee_profiles")
          .update({ profile_picture: publicURL })
          .eq("id", employeeData.id);

        if (updateError) throw new Error("Failed to update profile picture.");

        setProfilePicture(publicURL);
        setEmployeeData((prev) => ({ ...prev, profile_picture: publicURL }));
        toast.success("Profile picture updated successfully.");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsUploading(false); // Stop uploading process
      }
    }
  };

  // Save changes to database
  const handleSaveChanges = async () => {
    try {
      if (!employeeData.first_name || !employeeData.last_name) {
        toast.error("First Name and Last Name are required!");
        return;
      }

      const { error } = await supabase
        .from("employee_profiles")
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
        .eq("id", employeeData.id);

      if (error) throw new Error("Failed to update profile.");

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Toggle edit mode and save changes when exiting
  const toggleEditMode = () => {
    if (isEditable) handleSaveChanges();
    setIsEditable(!isEditable);
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-indigo-600 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl p-8 md:p-12 lg:p-16 bg-white rounded-2xl shadow-xl mt-6 overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">
            {employeeData.first_name} {employeeData.last_name}
          </h2>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Profile Picture Card */}
          <div className="bg-gradient-to-tl from-green-400 via-teal-500 to-blue-500 p-6 rounded-xl shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="text-center">
              <h3 className="text-2xl text-white font-semibold mb-4">Profile Picture</h3>
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                {isUploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    Uploading...
                  </div>
                ) : temporaryImage ? (
                  <img
                    src={temporaryImage}
                    alt="Temporary Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              {isEditable && (
                <input
                  type="file"
                  onChange={handleProfilePictureChange}
                  className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:bg-indigo-600 file:text-white file:rounded-md file:hover:bg-indigo-700 transition-all duration-200"
                />
              )}
            </div>
          </div>
  
          {/* Name, Phone, Email, and Other Details */}
          <div className="bg-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105">
            <label className="text-lg font-semibold text-gray-800">Full Name</label>
            <input
              type="text"
              name="first_name"
              value={employeeData.first_name || ""}
              onChange={handleChange}
              disabled={!isEditable}
              className="mt-2 p-3 w-full border rounded-lg"
              placeholder="First Name"
            />
            <input
              type="text"
              name="last_name"
              value={employeeData.last_name || ""}
              onChange={handleChange}
              disabled={!isEditable}
              className="mt-2 p-3 w-full border rounded-lg"
              placeholder="Last Name"
            />
          </div>
          
          {/* Birthday and Position Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="mb-4">
              <label htmlFor="date_of_birth" className="text-lg font-semibold text-gray-800">Birthday</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={employeeData.date_of_birth || ""}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                disabled={!isEditable}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="position" className="text-lg font-semibold text-gray-800">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={employeeData.position || ""}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                disabled={!isEditable}
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="bg-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105">
            <label className="text-lg font-semibold text-gray-800">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={employeeData.phone_number || ""}
              onChange={handleChange}
              disabled={!isEditable}
              className="mt-2 p-3 w-full border rounded-lg"
              placeholder="Phone Number"
            />
            <label className="text-lg font-semibold text-gray-800 mt-4 block">Email</label>
            <input
              type="email"
              name="email"
              value={employeeData.email || ""}
              onChange={handleChange}
              disabled={!isEditable}
              className="mt-2 p-3 w-full border rounded-lg"
              placeholder="Email"
            />
          </div>
        </div>

        {/* Edit/Save Button */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleEditMode}
            className={`px-6 py-3 rounded-lg text-white ${
              isEditable ? "bg-green-500 hover:bg-green-700" : "bg-indigo-500 hover:bg-indigo-700"
            } transition-all duration-200`}
          >
            {isEditable ? "Save Changes" : "Edit Details"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeePersonalDetails;

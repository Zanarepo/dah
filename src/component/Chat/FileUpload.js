import React, { useState } from 'react';
import { HiOutlineUpload } from "react-icons/hi"; // Importing an icon

const FileUpload = ({ sendFileMessage }) => {
  const [file, setFile] = useState(null); // Store selected file
  const [fileUrl, setFileUrl] = useState(null); // Store file URL for preview

  // Handle file change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Create URL for preview
    const previewUrl = URL.createObjectURL(selectedFile);
    setFileUrl(previewUrl); // Set file URL for preview
  };

  // Handle send action (send the file to the parent chat UI)
  const handleSendFile = () => {
    sendFileMessage(fileUrl); // Send the file URL to the chat (this is where the chat UI is updated)
    setFile(null); // Reset file after sending
    setFileUrl(null); // Clear file preview
  };

  return (
    <div className="p-4">
      {/* Send File Button */}
      <label
        htmlFor="file-input"
        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
      >
        <HiOutlineUpload className="w-5 h-5" />
        <span>Send File</span>
      </label>

      {/* File Input */}
      <input
        type="file"
        id="file-input"
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {/* Preview File */}
      {fileUrl && (
        <div className="mt-4">
          <p>Preview:</p>
          {fileUrl.includes("image") ? (
            <img src={fileUrl} alt="uploaded file" className="max-w-xs" />
          ) : (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              View PDF
            </a>
          )}

          {/* Send button appears after preview */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleSendFile}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Send
            </button>
            <button
              onClick={() => {
                setFile(null); // Reset file
                setFileUrl(null); // Clear preview
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

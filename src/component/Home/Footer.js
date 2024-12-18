import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 text-center text-white mt-8">
      <div className="space-x-4">
        <button className="hover:text-gray-400">Privacy Policy</button>
        <button className="hover:text-gray-400">Terms of Service</button>
      </div>
      <p className="mt-4 text-sm">© 2024 Brand. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

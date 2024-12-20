import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-8 text-gray-800 border-t-4 border-gray-300 mt-12">
      {/* Footer Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Us</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            At Datafy, we empower individuals and organizations with innovative
            solutions, ensuring excellence and collaboration to drive success.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-600" />
              123 Tech Street, Innovation City, 56789
            </li>
            <li className="flex items-center">
              <FaPhone className="mr-2 text-blue-600" />
              +1 (123) 456-7890
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-2 text-blue-600" />
              contact@datafy.com
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-gray-700">
            <a
              href="https://facebook.com"
              className="p-2 rounded-full bg-gray-200 hover:bg-blue-100"
              aria-label="Facebook"
            >
              <FaFacebook className="text-blue-600 text-lg" />
            </a>
            <a
              href="https://twitter.com"
              className="p-2 rounded-full bg-gray-200 hover:bg-blue-100"
              aria-label="Twitter"
            >
              <FaTwitter className="text-blue-400 text-lg" />
            </a>
            <a
              href="https://instagram.com"
              className="p-2 rounded-full bg-gray-200 hover:bg-pink-100"
              aria-label="Instagram"
            >
              <FaInstagram className="text-pink-600 text-lg" />
            </a>
            <a
              href="https://linkedin.com"
              className="p-2 rounded-full bg-gray-200 hover:bg-blue-100"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-blue-700 text-lg" />
            </a>
          </div>
        </div>
      </div>

      {/* Links and Copyright */}
      <div className="mt-8 border-t pt-4 text-center">
        <div className="space-x-4 mb-2">
          <button className="text-sm text-gray-600 hover:text-blue-600">
            Privacy Policy
          </button>
          <button className="text-sm text-gray-600 hover:text-blue-600">
            Terms of Service
          </button>
        </div>
        <p className="text-xs text-gray-500">
          © 2024 Datafy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

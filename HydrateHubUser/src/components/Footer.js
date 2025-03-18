import React, { useContext } from 'react';
import '../styles/index.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

function Footer() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div>
      {/* Footer */}
      <footer className="w-full bg-gradient-to-b from-teal-300 to-blue-900 text-white py-12">
        <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center lg:justify-between">
          {/* Footer Logo and Summary */}
          <div className="mb-8 lg:mb-0 lg:w-1/3 text-center lg:text-left ">
            <img src={'/assets/logo.png'} alt="HydrateHub Footer Logo" id='footer-logo' className="mb-4 sm:justify-center sm:flex" />
            <p className="text-gray-300 max-w-sm mx-auto lg:mx-0" id='footer-text'>
              HydrateHub connects you with top vendors to provide high-quality filtered water directly to your doorstep. With our platform, you can choose from a variety of trusted water vendors ensuring the cleanest, freshest water every time.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col lg:flex-row lg:space-x-16 text-center lg:text-left">
            <div className="mb-6 lg:mb-0">
              <h3 className="font-semibold mb-4 text-gray-400">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/vendors" className="hover:text-gray-400">Our Vendors</Link></li>
                <li><Link to="/faq" className="hover:text-gray-400">FAQs</Link></li>
                {!isAuthenticated &&
                <>
                <li><Link to="/login" className="hover:text-gray-400">Login</Link></li>
                <li><Link to="/signup" className="hover:text-gray-400">Sign Up</Link></li>
                </>
                }
              </ul>
            </div>
            <div className="mb-6 lg:mb-0">
              <h3 className="font-semibold mb-4 text-gray-400">Contact</h3>
              <ul className="space-y-2">
                <li><Link to="/contact" className="hover:text-gray-400">Contact Us</Link></li>
                <li><Link to="/contact" className="hover:text-gray-400">Become a Vendor</Link></li>
                <li><Link to="/about" className="hover:text-gray-400">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-400">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacypolicy" className="hover:text-gray-400">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-gray-400">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mt-6">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-800">
            <FaLinkedinIn />
          </a>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-500 pt-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} HydrateHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

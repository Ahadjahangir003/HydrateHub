import '../styles/index.css';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaUserAlt, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    logout();
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log('Token is expired. Logging out...');
            handleLogout();
          } else {
            setUsername(decodedToken.name || 'User');
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('userToken');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkToken();
    const timerId = setInterval(() => {
      checkToken();
    }, 30000);

    return () => clearInterval(timerId);
  }, [isLoggedIn]);

  return (
    <div>
      <nav id="" className="bg-gradient-to-r from-teal-300 to-indigo-600 fixed w-full z-10 h-16 top-0">
        <div id="navbar-container" className="flex justify-between items-center p-4">
          {/* Left: Logo */}
          <div id="navbar-logo" className=" relative flex items-center">
            <Link to="/">
              <img
                src={'/assets/logo.png'}
                alt="HydrateHub Logo"
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
            </Link>
            <Link to="/" className="ml-2 text-white text-xl font-bold font-mono">
              HydrateHub
            </Link>
          </div>

          {/* Right: Links */}
          <div className="hidden lg:flex space-x-4 items-center gap-4 text-white" id="navbar-links">
            <Link
              to="/plist"
              className="navbar-link rounded-full hover:bg-slate-200 p-1 px-2 hover:text-blue-600"
            >
              Products
            </Link>
            <Link
              to="/packagelist"
              className="navbar-link rounded-full hover:bg-slate-200 p-1 px-2 hover:text-blue-600"
            >
              Packages
            </Link>
            <Link
              to="/vendors"
              className="navbar-link rounded-full hover:bg-slate-200 p-1 px-2 hover:text-blue-600"
            >
              Vendors
            </Link>
            <Link
              to="/contact"
              className="navbar-link rounded-full hover:bg-slate-200 p-1 px-2 hover:text-blue-600"
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              className="navbar-link rounded-full hover:bg-slate-200 p-1 px-2 hover:text-blue-600"
            >
              About Us
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/user-profile"
                  className="navbar-link rounded-full hover:bg-slate-200 p-1 px-2 hover:text-blue-600"
                >
                  <div className="flex items-center">
                    {username} <FaUserAlt className="ml-2" />
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="navbar-link rounded-full hover:bg-red-500 p-1 px-2 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="navbar-link rounded-full hover:bg-slate-200 p-1 px-2 hover:text-blue-600"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white text-2xl focus:outline-none"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col space-y-4 p-4 -mt-2 text-white text-center bg-gradient-to-r from-teal-300 to-indigo-600">
            <Link
              to="/plist"
              className="navbar-link rounded-full hover:bg-slate-200 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/packagelist"
              className="navbar-link rounded-full hover:bg-slate-200 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Packages
            </Link>
            <Link
              to="/vendors"
              className="navbar-link rounded-full hover:bg-slate-200 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Vendors
            </Link>
            <Link
              to="/contact"
              className="navbar-link rounded-full hover:bg-slate-200 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              className="navbar-link rounded-full hover:bg-slate-200 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/user-profile"
                  className="navbar-link rounded-full hover:bg-slate-200 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex justify-center items-center">
                    {username} <FaUserAlt className="ml-2" />
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="navbar-link rounded-full hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="navbar-link rounded-full hover:bg-slate-200 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;

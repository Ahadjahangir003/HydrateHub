import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaUsers, FaUserPlus, FaList, FaBox, FaBars, FaSignOutAlt, FaBoxes, FaClipboardList } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();  // Use the global state
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    logout();
  };

  return (
    <div
      className={`h-screen ${
        isSidebarCollapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-indigo-300 to-blue-950 text-white fixed transition-all duration-300 flex flex-col`}
    >
      {isSidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-blue-700 hover:bg-blue-600 p-2 rounded-full"
        >
          <FaBars size={20} />
        </button>
      )}
      <div
        className={`flex items-center justify-between p-4 border-b border-gray-300 ${
          isSidebarCollapsed ? "justify-center" : ""
        }`}
      >
        <Link to="/dashboard" className="flex justify-between items-center">
          <img
            src="/assets/logo.png" // Replace with your actual logo path
            alt="HydrateHub Logo"
            className={`${
              isSidebarCollapsed ? "w-10 h-10 mt-16" : "w-20 h-20"
            } transition-all duration-300`}
          />
            {!isSidebarCollapsed && <span className="ml-2"><b>HydrateHub</b></span>}
        </Link>
        {!isSidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none -mt-12 -mr-2 hover:bg-blue-600 rounded p-2"
          >
            <FaBars size={20} />
          </button>
        )}
      </div>

      <nav className="mt-4 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaHome className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Dashboard</span>}
          </NavLink>
          <NavLink
            to="/create-vendor"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaUserPlus className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Add Vendor</span>}
          </NavLink>
          <NavLink
            to="/vendor-list"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaList className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Vendors</span>}
          </NavLink>
          <NavLink
            to="/user-list"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaUsers className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Users</span>}
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaBox className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Products</span>}
          </NavLink>
          <NavLink
            to="/packages"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaBoxes className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Packages</span>}
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaClipboardList className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Orders</span>}
          </NavLink>
        </div>

        {/* Logout Button */}
        <div className="mt-auto mb-4">
          <NavLink
            onClick={handleLogout}
            className={`flex items-center px-4 mx-4 rounded-lg py-2  hover:bg-red-600 ${
              isSidebarCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            <FaSignOutAlt className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Logout</span>}
          </NavLink>
        </div>
      </nav>

      {/* Toggler Icon for collapsed sidebar */}
      
    </div>
  );
};

export default Sidebar;

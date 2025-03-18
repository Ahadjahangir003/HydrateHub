import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaBars, FaSignOutAlt} from "react-icons/fa";
import { LuPackageCheck} from "react-icons/lu";
import { FaClipboardList, FaMoneyBillAlt } from "react-icons/fa";
import { HiOutlineOfficeBuilding} from "react-icons/hi";
import { TbCubePlus, TbCylinder, TbCylinderPlus } from "react-icons/tb";
import { AuthContext } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import {jwtDecode} from 'jwt-decode'
const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();  // Use the global state
  const { logout } = useContext(AuthContext);
  const [ name, setName]=useState();
  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    logout();
  };

  useEffect(()=>{
    const token =localStorage.getItem('vendorToken')
    const decodedToken =jwtDecode(token)
    setName(decodedToken.cname)
  },[])

  return (
    <div
      className={`h-screen ${
        isSidebarCollapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-teal-300 to-blue-900 text-white fixed transition-all duration-300 flex flex-col`}
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
        <Link to="/vednor-dashboard" className="flex justify-between items-center">
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
        <div className="space-y-2">
          <NavLink
            to="/vendor-dashboard"
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
            to="/add-product"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <TbCubePlus className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Add Product</span>}
          </NavLink>
          <NavLink
            to="/all-products"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <LuPackageCheck className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Products</span>}
          </NavLink>
          <NavLink
            to="/add-package"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <TbCylinderPlus className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Add Package</span>}
          </NavLink>
          <NavLink
            to="/all-packages"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <TbCylinder className="text-lg" />
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
          <NavLink
            to="/finance"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-blue-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            
            <FaMoneyBillAlt className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Finance Report</span>}
          </NavLink>
        </div>

        {/* Logout Button */}
        <div className="mt-auto mb-4">
          <NavLink
            to='/vendor-profile'
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-lg  hover:bg-green-500 hover:text-white ${
                isActive ? "bg-white text-blue-600" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <HiOutlineOfficeBuilding className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">{name}</span>}
          </NavLink>
          <NavLink
            onClick={handleLogout}
            className={`flex mt-3 items-center px-4 mx-4 rounded-lg py-2  hover:bg-red-600 ${
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

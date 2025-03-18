import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../styles/index.css'; // External CSS


function Vendors() {
  const [vendors, setVendors]= useState([]);
  const hasErrorRef = useRef(false);
  const navigate= useNavigate();
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin/partners", {
        });
        setVendors(response.data || []);
        hasErrorRef.current = false; // Reset the error state on successful fetch
      } catch (error) {
        console.error("Error fetching vendors:", error);
        if (!hasErrorRef.current) {
          toast.error("Failed to fetch vendor data!"); // Show toast only once
          hasErrorRef.current = true; // Set the error state to true after showing the toast
        }
      }
    };

    fetchVendors();
  }, []);  
  
  return (
    <div id="vendors-container" className="flex flex-col min-h-screen">
      {/* Top Section */}
      <div id="vendors-image-section" className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: `url('/images/water.jpg')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl text-white font-bold">Vendors</h1>
        </div>
      </div>

      {/* Page Details Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Trusted Water Filter Vendors in Lahore</h2>
        <p className="mb-8">
          Here you can find some of the best water filter companies in Lahore offering top-notch water purification systems to ensure you have clean and safe drinking water.
        </p>
        <div className="flex flex-col gap-6 w-full justify-center items-center">
          {vendors.map(vendor => (
            <div key={vendor.id} className="flex flex-col md:flex-row text-center md:text-start bg-gradient-to-r from-indigo-500 to-teal-400 w-9/12 shadow-lg rounded-xl p-4">
              <div className=" px-4">
                <img src={vendor.image? `http://localhost:3001/uploads/${vendor.image}`: '/assets/DefaultCompany.png'} alt={vendor.name} className="md:w-44 h-32 w-full md:h-full rounded-lg" />
              </div>
              <div className="md:w-3/4 mt-4 md:mt-0 md:pl-4">
                <h3 className="text-xl font-bold !text-white">{vendor.companyName}</h3>
                <p className="!text-gray-200 mb-2">About: {vendor.about || 'This is a company that Sells Water'}</p>
                <p className="text-sm !text-gray-200">Address: {vendor.location}</p>
                <button className="w-auto bg-gradient-to-r from-teal-200  to-blue-200 text-gray-600 py-2 px-4 rounded-full mt-6 hover:scale-95 duration-300 ease-in-out"
                onClick={()=>navigate(`/vendor-detail/${vendor._id}`)}
                >View More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Vendors;

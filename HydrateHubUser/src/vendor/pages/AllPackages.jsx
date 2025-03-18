// components/AllPackages.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AllPackages = () => {
  const [packages, setPackages] = useState([]);

  // Fetch all packages from the backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem('vendorToken');
        const decodedToken = jwtDecode(token);
        const response = await axios.get(`http://localhost:3001/package/vendor-packages/${decodedToken.userId}`);
        setPackages(response.data); // Assuming the response is an array of packages
      } catch (error) {
        toast.error("Failed to fetch packages");
      }
    };

    fetchPackages();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      // Ensure the correct delete route is used
      await axios.delete(`http://localhost:3001/package/delete-package/${id}`);
      toast.success("Package deleted successfully!");
      setPackages(packages.filter(pkg => pkg._id !== id)); // Update UI after deletion
    } catch (error) {
      toast.error("Failed to delete package");
      console.log(error); // For debugging
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-[#cdffd8] to-[#94b9ff]">
      <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-11/12 md:w-3/4 lg:w-4/5">
        <h2 className="text-2xl font-bold text-center mb-6">All Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg._id} className="bg-white p-4 rounded-md shadow-md flex flex-col justify-between">
                <div>
                  <img
                    src={`http://localhost:3001/uploads/${pkg.image}`} // Correct path
                    alt={pkg.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="mt-4 text-lg font-semibold">{pkg.title}</h3>
                  <p className="text-gray-600">Price: {pkg.price} PKR</p>
                  <p className="text-gray-600">Duration: {pkg.duration} days</p>
                </div>
                <div className="bg-gray-400 flex justify-center mt-4">
                  <Link to={`/edit-package/${pkg._id}`} className="hover:text-blue-500 text-white py-1 px-2 rounded-md">
                    <FaPencilAlt />
                  </Link>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="hover:text-red-500 text-white py-1 px-2 rounded-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No packages available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPackages;

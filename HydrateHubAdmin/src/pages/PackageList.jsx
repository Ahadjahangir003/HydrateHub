import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash icon
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSidebar } from "../context/SidebarContext";

const PackageList = () => {
  const [cpackages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { isSidebarCollapsed } = useSidebar();

  const [isModalOpen, setIsModalOpen] = useState(false); // For the confirmation modal
  const [cpackageToDelete, setPackageToDelete] = useState(null); // Store the cpackage to delete
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(5); // Items per page (you can adjust this value)

  const hasErrorRef = useRef(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken"); // Get admin token from localStorage
        const response = await axios.get("http://localhost:3001/package/all-packages", {
          headers: {
            Authorization: adminToken, // Send token in Authorization header
          },
        });
        setPackages(response.data || []);
        hasErrorRef.current = false; // Reset the error state on successful fetch
      } catch (error) {
        console.error("Error fetching cpackages:", error);
        if (!hasErrorRef.current) {
          toast.error("Failed to fetch cpackage data!"); // Show toast only once
          hasErrorRef.current = true; // Set the error state to true after showing the toast
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [isModalOpen]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const filteredPackages = cpackages.filter(
    (cpackage) =>
      cpackage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cpackage.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current packages to display
  const indexOfLastPackage = currentPage * itemsPerPage;
  const indexOfFirstPackage = indexOfLastPackage - itemsPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);

  const handleDelete = async () => {    
    if (!cpackageToDelete) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await axios.delete(`http://localhost:3001/admin/cpackage/${cpackageToDelete}`, {
        headers: {
          Authorization: adminToken,
        },
      });

      if (response.status === 200) {
        // Remove the deleted cpackage from the state
        setPackages(cpackages.filter((cpackage) => cpackage.id !== cpackageToDelete));
        toast.success("Package deleted successfully"); // Success toast
      }
    } catch (error) {
      console.error("Error deleting cpackage:", error);
      toast.error("Failed to delete cpackage");
    } finally {
      setIsModalOpen(false); // Close the modal after the operation
      setPackageToDelete(null); // Reset the cpackageToDelete state
    }
  };

  const openDeleteModal = (cpackageId) => {
    setPackageToDelete(cpackageId); // Set the cpackage ID to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without performing any action
    setPackageToDelete(null); // Reset cpackageToDelete state
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 bg-gray-400 hover:bg-gray-300 rounded-full"
        >
          Previous
        </button>
        {pageNumbers
          .filter(
            (number) =>
              number === 1 ||
              number === totalPages ||
              (number >= currentPage - 1 && number <= currentPage + 1)
          )
          .map((number, index, arr) => (
            <React.Fragment key={number}>
              {index > 0 && number !== arr[index - 1] + 1 && (
                <span className="px-2">...</span>
              )}
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 mx-1 ${
                  currentPage === number ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-gray-300"
                } rounded-full`}
              >
                {number}
              </button>
            </React.Fragment>
          ))}
        <button
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 bg-gray-400 hover:bg-gray-300 rounded-full"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className={`p-4 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] h-screen`}>
      <div className="bg-gray-200 px-3 py-8 mx-3 rounded-xl shadow-lg h-full">
        <h2 className="text-3xl font-bold text-gray-600 mb-4 text-center">Package List</h2>
        <p className="mb-4 text-gray-600 text-center">List of all available cpackages</p>

        {/* Search Input */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by Title or Vendor Name"
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full shadow-lg rounded-lg border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 py-2">No.</th>
                  <th className="border border-gray-300 py-2">Title</th>
                  <th className="border border-gray-300 py-2">Price</th>
                  <th className="border border-gray-300 py-2">Vendor</th>
                  <th className="border border-gray-300 py-2">Image</th>
                  <th className="border border-gray-300 py-2">Created At</th>
                  <th className="border border-gray-300 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPackages.map((cpackage, index) => (
                  <tr key={cpackage._id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{cpackage.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{cpackage.price}</td>
                    <td className="border border-gray-300 px-4 py-2">{cpackage.vendor}</td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`http://localhost:3001/uploads/${cpackage.image}`}
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(cpackage.createdAt)}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => openDeleteModal(cpackage._id)}
                        className="text-red-500 hover:text-red-700"
                        >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination()}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-600 bg-opacity-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
              <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this package?</h3>
              <div className="flex justify-between">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageList;

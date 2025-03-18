import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash icon
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSidebar } from "../context/SidebarContext";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { isSidebarCollapsed } = useSidebar();

  const [isModalOpen, setIsModalOpen] = useState(false); // For the confirmation modal
  const [vendorToDelete, setVendorToDelete] = useState(null); // Store the vendor to delete
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const hasErrorRef = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust the number of items per page

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken"); // Get admin token from localStorage
        const response = await axios.get("http://localhost:3001/admin/partners", {
          headers: {
            Authorization: adminToken, // Send token in Authorization header
          },
        });
        setVendors(response.data || []);
        hasErrorRef.current = false; // Reset the error state on successful fetch
      } catch (error) {
        console.error("Error fetching vendors:", error);
        if (!hasErrorRef.current) {
          toast.error("Failed to fetch vendor data!"); // Show toast only once
          hasErrorRef.current = true; // Set the error state to true after showing the toast
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [isModalOpen]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  const handleDelete = async () => {
    if (!vendorToDelete) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await axios.delete(`http://localhost:3001/admin/partner/${vendorToDelete}`, {
        headers: {
          Authorization: adminToken,
        },
      });

      if (response.status === 200) {
        // Remove the deleted vendor from the state
        setVendors(vendors.filter((vendor) => vendor.id !== vendorToDelete));
        toast.success("Vendor deleted successfully"); // Success toast
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Failed to delete vendor");
    } finally {
      setIsModalOpen(false); // Close the modal after the operation
      setVendorToDelete(null); // Reset the vendorToDelete state
    }
  };

  const openDeleteModal = (vendorId) => {
    setVendorToDelete(vendorId); // Set the vendor ID to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without performing any action
    setVendorToDelete(null); // Reset vendorToDelete state
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <h2 className="text-3xl font-bold text-gray-600 mb-4 text-center">Vendor List</h2>
        <p className="mb-4 text-gray-600 text-center">List of all registered vendors</p>

        {/* Search Input */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by Company Name or Email"
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full shadow-lg rounded-lg border-collapse border border-blue-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 py-2">No.</th>
                  <th className="border border-gray-300 py-2">Owner</th>
                  <th className="border border-gray-300 py-2">Company Name</th>
                  <th className="border border-gray-300 py-2">Phone</th>
                  <th className="border border-gray-300 py-2">CNIC</th>
                  <th className="border border-gray-300 py-2">Email</th>
                  <th className="border border-gray-300 py-2">Created At</th>
                  <th className="border border-gray-300 py-2">Actions</th> {/* Added Actions column */}
                </tr>
              </thead>
              <tbody>
                {currentVendors.map((vendor, index) => (
                  <tr key={vendor._id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{vendor.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{vendor.companyName}</td>
                    <td className="border border-gray-300 px-4 py-2">{vendor.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">{vendor.cnic}</td>
                    <td className="border border-gray-300 px-4 py-2">{vendor.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(vendor.createdAt)}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => openDeleteModal(vendor._id)} // Open modal with vendor ID
                        className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td> {/* Delete button */}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVendors.length === 0 && (
              <div className="w-full text-center py-4">No vendors found</div>
            )}
            {renderPagination()}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this vendor?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;

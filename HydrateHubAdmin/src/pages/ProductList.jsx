import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash icon
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSidebar } from "../context/SidebarContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [productsPerPage] = useState(5); // Products per page
  const { isSidebarCollapsed } = useSidebar();

  const [isModalOpen, setIsModalOpen] = useState(false); // For the confirmation modal
  const [productToDelete, setProductToDelete] = useState(null); // Store the product to delete

  const hasErrorRef = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken"); // Get admin token from localStorage
        const response = await axios.get("http://localhost:3001/admin/products", {
          headers: {
            Authorization: adminToken, // Send token in Authorization header
          },
        });
        setProducts(response.data || []);
        hasErrorRef.current = false; // Reset the error state on successful fetch
      } catch (error) {
        console.error("Error fetching products:", error);
        if (!hasErrorRef.current) {
          toast.error("Failed to fetch product data!"); // Show toast only once
          hasErrorRef.current = true; // Set the error state to true after showing the toast
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isModalOpen]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await axios.delete(`http://localhost:3001/admin/product/${productToDelete}`, {
        headers: {
          Authorization: adminToken,
        },
      });

      if (response.status === 200) {
        // Remove the deleted product from the state
        setProducts(products.filter((product) => product.id !== productToDelete));
        toast.success("Product deleted successfully"); // Success toast
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsModalOpen(false); // Close the modal after the operation
      setProductToDelete(null); // Reset the productToDelete state
    }
  };

  const openDeleteModal = (productId) => {
    setProductToDelete(productId); // Set the product ID to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without performing any action
    setProductToDelete(null); // Reset productToDelete state
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
        <h2 className="text-3xl font-bold text-gray-600 mb-4 text-center">Product List</h2>
        <p className="mb-4 text-gray-600 text-center">List of all available products</p>

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
          <>
            <div className="overflow-x-auto">
              <table className="table-auto w-full shadow-lg rounded-lg border-collapse border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 py-2">No.</th>
                    <th className="border border-gray-300 py-2">Title</th>
                    <th className="border border-gray-300 py-2">Price</th>
                    <th className="border border-gray-300 py-2">Stock</th>
                    <th className="border border-gray-300 py-2">Vendor</th>
                    <th className="border border-gray-300 py-2">Image</th>
                    <th className="border border-gray-300 py-2">Created At</th>
                    <th className="border border-gray-300 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={product._id} className="text-center">
                      <td className="border border-gray-300 py-2">{index + 1 + (currentPage - 1) * productsPerPage}</td>
                      <td className="border border-gray-300 py-2">{product.title}</td>
                      <td className="border border-gray-300 py-2">{product.price}</td>
                      <td className="border border-gray-300 py-2">{product.stock}</td>
                      <td className="border border-gray-300 py-2">{product.vendor}</td>
                      <td className="border border-gray-300 py-2 flex justify-center">
                        <img
                          className="h-9 w-9 rounded-full"
                          src={`http://localhost:3001/uploads/${product.image}`}
                          alt="Product"
                        />
                      </td>
                      <td className="border border-gray-300 py-2">{formatDate(product.createdAt)}</td>
                      <td className="border border-gray-300 py-2">
                        <button
                          onClick={() => openDeleteModal(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Render pagination */}
            {renderPagination()}
          </>
        )}
      </div>
      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

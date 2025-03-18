import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // For the confirmation modal
  const [orderToUpdate, setOrderToUpdate] = useState(null); // Store the order to update

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const hasErrorRef = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7; // Number of orders per page

  useEffect(() => {
            const token = localStorage.getItem('vendorToken');
            const decodedToken = jwtDecode(token);
    
    const fetchOrders = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken"); // Get admin token from localStorage
        const response = await axios.get(`http://localhost:3001/order/vendor-orders/${decodedToken.userId}`, {
          headers: {
            Authorization: adminToken, // Send token in Authorization header
          },
        });
        setOrders(response.data || []);
        hasErrorRef.current = false; // Reset the error state on successful fetch
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (!hasErrorRef.current) {
          toast.error("Failed to fetch order data!"); // Show toast only once
          hasErrorRef.current = true; // Set the error state to true after showing the toast
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refresh]);

  const handleUpdate = async () => {
    if (!orderToUpdate) return;

    try {
      const response = await axios.patch(`http://localhost:3001/order/status-update/${orderToUpdate}`, {
      });

      if (response.status === 200) {
        toast.success("Order Status updated successfully"); // Success toast
        setRefresh((prev)=> !prev)
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update status");
    } finally {
      setIsModalOpen(false); // Close the modal after the operation
      setOrderToUpdate(null); // Reset the orderToUpdate state
    }
  };

  const openUpdateModal = (orderId) => {
    setOrderToUpdate(orderId); // Set the order ID to be updated
    setIsModalOpen(true); // Open the confirmation modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without performing any action
    setOrderToUpdate(null); // Reset orderToUpdate state
  };


  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order?.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);


  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
    <div className={`p-4 bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] h-screen`}>
      <div className="bg-gray-200 px-3 py-8 mx-3 rounded-xl shadow-lg h-full">
        <h2 className="text-3xl font-bold text-gray-600 mb-4 text-center">Orders List</h2>
        <p className="mb-4 text-gray-600 text-center">List of Your placed orders</p>

        {/* Search Input */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by Consumer Name"
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
                  <th className="border border-gray-300 py-2">Product Name</th>
                  <th className="border border-gray-300 py-2">Consumer</th>
                  <th className="border border-gray-300 py-2">Type</th>
                  <th className="border border-gray-300 py-2">Price</th>
                  <th className="border border-gray-300 py-2">Quantity</th>
                  <th className="border border-gray-300 py-2">Status</th>
                  <th className="border border-gray-300 py-2">Ordered At</th>
                  <th className="border border-gray-300 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={order._id} className="text-center border border-gray-300 px-4 py-2">
                    <td className="border border-gray-300 py-2">{index + 1}</td>
                    <td className="border border-gray-300 py-2">{order.p}</td>
                    <td className="border border-gray-300 py-2">{order.user}</td>
                    <td className="border border-gray-300 py-2">{order.type}</td>
                    <td className="border border-gray-300 py-2">{order.price}</td>
                    <td className="border border-gray-300 py-2">{order.quantity || 'NA'}</td>
                    <td className="border border-gray-300 py-2">{order.status}</td>
                    <td className="border border-gray-300 py-2">{formatDate(order.createdAt)}</td>
                                        <td className="border border-gray-300 py-2">
                                          <button
                                            disabled={order.status === "Completed"} // Disable button if status is completed
                                            onClick={() => openUpdateModal(order._id)} // Open modal with order ID
                                            className="text-green-500 hover:text-green-700"
                                            title="Update Status"
                                          >
                                            <FaPencilAlt />
                                          </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="w-full text-center">
                <p className="text-center text-gray-600 font-semibold mt-2">No Records Found</p>
              </div>
            )}
          </div>
        )}

        {/* Render Pagination */}
        {renderPagination()}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Are you sure you want to update the status to completed?</h3>
            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Yes, Update
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;

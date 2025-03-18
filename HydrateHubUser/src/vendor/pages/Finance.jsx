import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Finance = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState(false);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const hasErrorRef = useRef(false);
  const dropdownTimeoutRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7; // Number of orders per page

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    const decodedToken = jwtDecode(token);

    const fetchOrders = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken"); // Get admin token from localStorage
        const response = await axios.get(
          `http://localhost:3001/order/vendor-orders/${decodedToken.userId}`,
          {
            headers: {
              Authorization: adminToken, // Send token in Authorization header
            },
          }
        );
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
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
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
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 hover:bg-gray-300"
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

  const generatePDF = (type) => {
    const doc = new jsPDF();

    // Calculate page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header: Centered Title and Subtext
    const headerTitle = "Sales Report";
    const headerSubtitle = `List of Your ${type} Sales`;
    doc.setFontSize(18);
    doc.text(headerTitle, pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(headerSubtitle, pageWidth / 2, 23, { align: "center" });

    const tableColumn = [
      "No.",
      "Paid By",
      "Type",
      "Payment Amount(Rs)",
      "Payment Date",
    ];
    const tableRows = [];

    // Filter orders based on report type
    const now = new Date();
    let filteredOrdersForReport = filteredOrders;

    if (type === "Daily") {
      filteredOrdersForReport = filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (type === "Weekly") {
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      filteredOrdersForReport = filteredOrders.filter(
        (order) => new Date(order.createdAt) >= lastWeek
      );
    } else if (type === "Monthly") {
      const lastMonth = new Date(now);
      lastMonth.setDate(now.getDate() - 30);
      filteredOrdersForReport = filteredOrders.filter(
        (order) => new Date(order.createdAt) >= lastMonth
      );
    }

    // Populate table rows from filteredOrdersForReport
    filteredOrdersForReport.forEach((order, index) => {
      const paymentAmount = order.quantity
        ? order.price * order.quantity
        : order.price;
      const rowData = [
        index + 1,
        order.user,
        order.type,
        paymentAmount,
        formatDate(order.createdAt),
      ];
      tableRows.push(rowData);
    });

    // Add autoTable with a footer callback for the timestamp on each page
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      didDrawPage: function (data) {
        // Footer: Add timestamp at the bottom right corner
        const timestamp = "Generated on: " + new Date().toLocaleString();
        doc.setFontSize(10);
        doc.text(timestamp, pageWidth - 4, 6, {
          align: "right",
        });
      },
    });

    doc.save(`${type}_Sales_Report.pdf`);
    setReportType(false); // Close dropdown after generating report
  };

  const handleDropdownToggle = () => {
    setReportType((prev) => !prev);
    if (!reportType) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setReportType(false);
      }, 3001);
    } else {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  const handleOptionClick = (type) => {
    generatePDF(type);
    clearTimeout(dropdownTimeoutRef.current);
  };

  return (
    <div className={`p-4 bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] h-screen`}>
      <div className="bg-gray-200 px-3 py-8 mx-3 rounded-xl shadow-lg h-full">
        <h2 className="text-3xl font-bold text-gray-600 mb-4 text-center">
          Sales Report
        </h2>
        <p className="mb-4 text-gray-600 text-center">
          List of Your Total Sales
        </p>

        {/* Search Input */}
        <div className="mb-4 flex flex-row !items-center justify-between">
          <input
            type="text"
            placeholder="Search by Consumer Name"
            className="w-full md:w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Generate Report Dropdown */}
          <div className="relative">
            <button
              className="px-3 py-2 gap-2  flex flex-row items-center bg-teal-500 text-white rounded-md duration-300"
              onClick={handleDropdownToggle}
            >
              <FaPrint /> Generate Report
            </button>
            {reportType && (
              <div className="absolute right-0 w-44 bg-white border border-gray-300 rounded-md shadow-lg">
                <button
                  onClick={() => handleOptionClick("Daily")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Daily Report
                </button>
                <button
                  onClick={() => handleOptionClick("Weekly")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Weekly Report
                </button>
                <button
                  onClick={() => handleOptionClick("Monthly")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Monthly Report
                </button>
                <button
                  onClick={() => handleOptionClick("Full")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Full Report
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full shadow-lg rounded-lg border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 py-2">No.</th>
                  <th className="border border-gray-300 py-2">Paid By</th>
                  <th className="border border-gray-300 py-2">Type</th>
                  <th className="border border-gray-300 py-2">
                    Payment Amount(Rs)
                  </th>
                  <th className="border border-gray-300 py-2">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="text-center border border-gray-300 px-4 py-2"
                  >
                    <td className="border border-gray-300 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 py-2">
                      {order.user}
                    </td>
                    <td className="border border-gray-300 py-2">
                      {order.type}
                    </td>
                    <td className="border border-gray-300 py-2">
                      {order.quantity
                        ? order.price * order.quantity
                        : order.price}
                    </td>
                    <td className="border border-gray-300 py-2">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="w-full text-center">
                <p className="text-center text-gray-600 font-semibold mt-2">
                  No Records Found
                </p>
              </div>
            )}
          </div>
        )}

        {/* Render Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Finance;

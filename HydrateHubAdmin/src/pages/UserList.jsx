import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash icon
import { FaCheck } from "react-icons/fa6"; // Import trash icon
import { IoMdClose } from "react-icons/io"; // Import trash icon
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSidebar } from "../context/SidebarContext";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { isSidebarCollapsed } = useSidebar();

  const [isModalOpen, setIsModalOpen] = useState(false); // For the confirmation modal
  const [userToDelete, setUserToDelete] = useState(null); // Store the user to delete
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const hasErrorRef = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7; // Number of users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken"); // Get admin token from localStorage
        const response = await axios.get("http://localhost:3001/admin/users", {
          headers: {
            Authorization: adminToken, // Send token in Authorization header
          },
        });
        setUsers(response.data || []);
        hasErrorRef.current = false; // Reset the error state on successful fetch
      } catch (error) {
        console.error("Error fetching users:", error);
        if (!hasErrorRef.current) {
          toast.error("Failed to fetch user data!"); // Show toast only once
          hasErrorRef.current = true; // Set the error state to true after showing the toast
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isModalOpen]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await axios.delete(`http://localhost:3001/admin/user/${userToDelete}`, {
        headers: {
          Authorization: adminToken,
        },
      });

      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== userToDelete));
        toast.success("User deleted successfully"); // Success toast
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsModalOpen(false); // Close the modal after the operation
      setUserToDelete(null); // Reset the userToDelete state
    }
  };

  const openDeleteModal = (userId) => {
    setUserToDelete(userId); // Set the user ID to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without performing any action
    setUserToDelete(null); // Reset userToDelete state
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
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
        <h2 className="text-3xl font-bold text-gray-600 mb-4 text-center">Users List</h2>
        <p className="mb-4 text-gray-600 text-center">List of all registered users</p>

        {/* Search Input */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by Name or Email"
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
                  <th className="border border-gray-300 py-2">Name</th>
                  <th className="border border-gray-300 py-2">Phone</th>
                  <th className="border border-gray-300 py-2">Email</th>
                  <th className="border border-gray-300 py-2">Verified</th>
                  <th className="border border-gray-300 py-2">Created At</th>
                  <th className="border border-gray-300 py-2">Actions</th> {/* Added Actions column */}
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user._id} className="text-center border border-gray-300 px-4 py-2">
                    <td className="border border-gray-300 py-2">{(((currentPage-1)*usersPerPage)+index) + 1}</td>
                    <td className="border border-gray-300 py-2">{user.name}</td>
                    <td className="border border-gray-300 py-2">{user.phone}</td>
                    <td className="border border-gray-300 py-2">{user.email}</td>
                    <td className={` text-lg flex items-end justify-center ${user.isVerified ? 'text-green-700' : 'text-red-600'} px-4 pt-3`}>
                      {user.isVerified ? <FaCheck /> : <IoMdClose />}
                    </td>
                    <td className="border border-gray-300 py-2">{formatDate(user.createdAt)}</td>
                    <td className="border border-gray-300 py-2">
                      <button
                        onClick={() => openDeleteModal(user._id)} // Open modal with user ID
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td> {/* Delete button */}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="w-full text-center">
                <p className="text-center text-gray-600 font-semibold mt-2">No Records Found</p>
              </div>
            )}
          </div>
        )}

        {/* Render Pagination */}
        {renderPagination()}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Yes, Delete
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

export default UserList;

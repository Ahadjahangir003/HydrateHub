import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      
      try {
        const token=localStorage.getItem('vendorToken');
                const decodedToken = jwtDecode(token);                
        const response = await axios.get(`http://localhost:3001/product/vendor-products/${decodedToken.userId}`);
        setProducts(response.data); // Assuming the response is an array of products
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, []);

  //hande delete
  const handleDelete = async (id) => {
    try {
      // Ensure the correct delete route is used
      await axios.delete(`http://localhost:3001/product/delete-product/${id}`);
      toast.success("Product deleted successfully!");
      setProducts(products.filter(product => product._id !== id)); // Update UI after deletion
    } catch (error) {
      toast.error("Failed to delete product");
      console.log(error); // For debugging
    }
  };
  

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-[#cdffd8] to-[#94b9ff]">
      <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-11/12 md:w-3/4 lg:w-4/5">
        <h2 className="text-2xl font-bold text-center mb-6">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-md shadow-md flex flex-col justify-between">
                <div>
                  <img
                      src={`http://localhost:3001/uploads/${product.image}`} // Correct path
                      alt={product.title}
                      className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="mt-4 text-lg font-semibold">{product.title}</h3>
                  <p className="text-gray-600">Price: {product.price} PKR</p>
                  <p className="text-gray-600">Stock: {product.stock}</p>
                </div>
                <div className="bg-gray-400 flex justify-center mt-4">
                  <Link to={`/edit-product/${product._id}`} className="hover:text-blue-500 text-white py-1 px-2 rounded-md">
                    <FaPencilAlt/>
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="hover:text-red-500 text-white py-1 px-2 rounded-md"
                  >
                    <FaTrash/>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

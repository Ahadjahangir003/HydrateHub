import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";



// Validation schema using Yup
const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  price: yup
    .number()
    .positive("Price must be a positive number")
    .required("Price is required"),
  stock: yup
    .number()
    .positive("Stock must be a positive number")
    .required("Stock is required"),
  details: yup.string().optional(),
  image: yup.mixed().required("Image is required"), // Ensuring that image is required
});

const AddProducts = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Set value for file input manually
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

// Inside AddProducts Component
const navigate = useNavigate();

  const [file, setFile] = useState(null);

  // Handle form submission
  const onSubmit = async (data) => {
        const token=localStorage.getItem('vendorToken');
        const decodedToken = jwtDecode(token);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("details", data.details);
    formData.append("image", file);
    formData.append("vendorId", decodedToken.userId);
    formData.append("vendor", decodedToken.cname);
    formData.append("vendorEmail", decodedToken.userEmail);

  
    try {
      await axios.post("http://localhost:3001/product/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      reset(); // Reset form fields
      setFile(null); // Reset file input
      navigate("/all-products"); // Redirect to All Products page
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };
  

  // Handle file change and set value for file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setValue("image", selectedFile); // Manually set file for React Hook Form
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-[#cdffd8] to-[#94b9ff]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-11/12 md:w-3/4 lg:w-1/2">
        {/* Product Creation Label */}
        <h2 className="text-2xl font-bold text-center mb-6">Add Product</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title Field */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter product title"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.title ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("title")}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Price Field */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type='text'
                id="price"
                placeholder="Enter product price"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.price ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("price")}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            {/* Stock Field */}
            <div className="mb-4">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="text"
                id="stock"
                placeholder="Enter product stock"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.stock ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("stock")}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
            </div>

            {/* Details Field */}
            <div className="mb-4 col-span-2">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                Details
              </label>
              <textarea
                id="details"
                placeholder="Enter product details"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.details ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("details")}
              />
            </div>

            {/* Image Field */}
            <div className="mb-4 col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.image ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                onChange={handleFileChange}
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-4/12 bg-blue-400 text-white py-2 rounded-md focus:outline-none hover:transition-all hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;

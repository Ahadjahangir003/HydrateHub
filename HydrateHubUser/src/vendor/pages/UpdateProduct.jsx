import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

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
  image: yup.mixed().optional(), // Optional, as we don't always need to upload a new image
});

const UpdateProduct = () => {
  const [product, setProduct] = useState(null);
  const [file, setFile] = useState(null);
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Hook for navigation

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Set value for file input manually
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  // Fetch product data by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/product/single-product/${id}`);
        setProduct(response.data);
        reset(response.data); // Set form values
      } catch (error) {
        toast.error("Failed to fetch product");
      }
    };

    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('details', data.details);

    if (file) {
      formData.append('image', file); // Append the new image if it's selected
    } else {
      formData.append('filename', product.image); // Keep the old image if not updated
    }

    try {
      await axios.patch(
        `http://localhost:3001/product/edit-product/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Product updated successfully!');
      navigate('/all-products'); // Redirect to All Products page
    } catch (error) {
      toast.error("Failed to update product");
      console.log(error);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setValue('image', selectedFile); // Manually set file for React Hook Form
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-[#cdffd8] to-[#94b9ff]">
      <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-11/12 md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-bold text-center mb-6">Update Product</h2>

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
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.title ? 'border-red-500' : 'focus:border-[#94b9ff]'
                }`}
                {...register('title')}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Price Field */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.price ? 'border-red-500' : 'focus:border-[#94b9ff]'
                }`}
                {...register('price')}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            {/* Stock Field */}
            <div className="mb-4">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.stock ? 'border-red-500' : 'focus:border-[#94b9ff]'
                }`}
                {...register('stock')}
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
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.details ? 'border-red-500' : 'focus:border-[#94b9ff]'
                }`}
                {...register('details')}
              />
            </div>

            {/* Image Field */}
            <div className="mb-4 col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              {product.image && (
                <img
                  src={`http://localhost:3001/uploads/${product.image}`}
                  alt="Product"
                  className="w-24 h-24 object-cover mb-4"
                />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.image ? 'border-red-500' : 'focus:border-[#94b9ff]'
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
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;

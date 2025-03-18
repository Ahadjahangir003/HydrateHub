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
  details: yup.string().optional(),
  image: yup.mixed().optional(), // Optional, as we don't always need to upload a new image
});
// const { id } = useParams();


const UpdatePackage = () => {
  const [currentPackage, setCurrentPackage] = useState(null);
  const [file, setFile] = useState(null);
  const { id } = useParams(); // Get the package ID from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [loading, setLoading] = useState(true);

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


useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/package/single-package/${id}`);
        setCurrentPackage(response.data);
        reset(response.data); // Set form values
        setLoading(false); // Data fetched successfully, set loading to false
      } catch (error) {
        toast.error("Failed to fetch package");
        console.error(error); // Log the error for debugging
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchPackage();
  }, [id, reset]);
  if (loading) return <div>Loading...</div>; // Show loa
  
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('details', data.details);

    if (file) {
      formData.append('image', file); // Append the new image if it's selected
    } else {
      formData.append('filename', currentPackage.image); // Keep the old image if not updated
    }

    try {
      await axios.patch(
        `http://localhost:3001/package/edit-package/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Package updated successfully!');
      navigate('/all-packages'); // Redirect to All packages page
    } catch (error) {
      toast.error("Failed to update package");
      console.log(error);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setValue('image', selectedFile); // Manually set file for React Hook Form
  };

  if (!currentPackage) return <div>Loading...</div>;

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-[#cdffd8] to-[#94b9ff]">
      <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-11/12 md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-bold text-center mb-6">Update Package</h2>

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
                Package Image
              </label>
              {currentPackage.image && (
                <img
                  src={`http://localhost:3001/uploads/${currentPackage.image}`}
                  alt="package"
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
              Update Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePackage;

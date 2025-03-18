import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { useSidebar } from "../context/SidebarContext";

// Validation schema using Yup
const validationSchema = yup.object().shape({
  companyName: yup.string().required("Company Name is required"),
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^(03[0-9]{9})$/, "Phone number must be 03XXXXXXXXX")
    .required("Phone is required"),
  cnic: yup
    .string()
    .matches(/^\d{13}$/, "CNIC must be exactly 13 digits")
    .required("CNIC is required"),
  location: yup.string().required("Location is required"),
});

const CreateVendor = () => {
  const { isSidebarCollapsed } = useSidebar();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const adminToken = localStorage.getItem("adminToken"); // Get admin token from localStorage
      const response = await axios.post(
        "http://localhost:3001/admin/create-vendor",
        data,
        {
          headers: {
            Authorization: adminToken, // Send token in Authorization header
          },
        }
      );
      toast.success("Vendor created successfully!");
      reset(); // Reset form fields on success
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`h-screen flex justify-center items-center bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] ${
        isSidebarCollapsed ? "ml-20" : "ml-64"
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-11/12">
        {/* Vendor Creation Label */}
        <h2 className="text-2xl font-bold text-center mb-6">Create Vendor</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name Field */}
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                placeholder="Enter company name"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.companyName ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.name ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.email ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                placeholder="Enter phone number"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.phone ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* CNIC Field */}
            <div className="mb-4">
              <label
                htmlFor="cnic"
                className="block text-sm font-medium text-gray-700"
              >
                CNIC
              </label>
              <input
                type="text"
                id="cnic"
                placeholder="Enter CNIC (13 digits)"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.cnic ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("cnic")}
              />
              {errors.cnic && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cnic.message}
                </p>
              )}
            </div>

            {/* Location Field */}
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Enter location"
                className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                  errors.location ? "border-red-500" : "focus:border-[#94b9ff]"
                }`}
                {...register("location")}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-4/12 bg-blue-400 text-white py-2 rounded-md focus:outline-none hover:transition-all hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Create Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVendor;

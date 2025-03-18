import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { AuthContext } from "../context/AuthContext";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  // Validation schema
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required"),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/admin/login", data); // Replace with actual API route
      const { token } = response.data;
      login();
      toast.success("Welcome Admin");
      localStorage.setItem("adminToken", token);
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Forgot password API call
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("http://localhost:3001/admin/forgot-password");
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to send Email, Try again.');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-[#cdffd8] to-[#94b9ff]">
            {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-96">
        
        <div className="text-center mb-4">
          <img
            src="assets/logo.png" // Replace with your logo path
            alt="HydrateHub Logo"
            className="w-16 h-16 mx-auto"
          />
        </div>

        {/* Sign In Label */}
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                errors.email ? "border-red-500" : "focus:border-[#94b9ff]"
              }`}
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Password"
              className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                errors.password ? "border-red-500" : "focus:border-[#94b9ff]"
              }`}
              {...register("password")}
            />
            <div
              className="absolute right-3 top-8 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full hover:cursor-pointer  bg-blue-400 text-white py-2 rounded-md focus:outline-none hover:transition-all hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

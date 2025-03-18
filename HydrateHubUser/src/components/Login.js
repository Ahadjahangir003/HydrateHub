import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userType, setUserType] = useState('consumer'); // Track the selected login type
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Toggle password visibility
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  // Configure react-hook-form with real-time validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      const endpoint =
        userType === 'consumer'
          ? 'http://localhost:3001/user/loginUser'
          : 'http://localhost:3001/user/loginVendor'; // Adjust endpoint based on userType

      const response = await axios.post(endpoint, {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        localStorage.removeItem('vpurpose');
        const token = response.data.token;
        const decodedToken = jwtDecode(token);
        const userName = decodedToken.name;
        if (userType === 'consumer') {
          localStorage.setItem('userToken', token)
        }
        else {
          localStorage.setItem('vendorToken', token);
        }
        login();
        toast.success(`Login successful! Welcome ${userName}`);
        if (userType === 'consumer') {
          navigate('/'); // Navigate to home page for consumers
        } else {
          navigate('/vendorDashboard'); // Navigate to vendor dashboard for vendors
        }
      }
    } catch (error) {
      console.error('Login error:', error);

      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div id="login-container" className="min-h-screen flex flex-col justify-center items-center">
      <div id="login-box">
        <ToastContainer /> {/* Toast container to display toasts */}
        <div id="login-logo">
          <Link to="/">
            <img src={'/assets/logo.png'} alt="Logo" id="login-logo-image" />
          </Link>
        </div>
        <h1 id="login-title">Sign In</h1>
        <h3 className='text-center text-blue-500  font-semibold'>as</h3>

        {/* User Type Switch */}
        <div id="login-switch" className="flex justify-center mb-4">
          <button
            className={`px-3 py-2 rounded-l-full ${userType === 'consumer' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserType('consumer')}
          >
            Consumer
          </button>
          <button
            className={`px-6 py-2 rounded-r-full ${userType === 'vendor' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserType('vendor')}
          >
            Vendor  
          </button>
        </div>

        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" id="login-label">Email</label>
            <input
              type="email"
              id="login-email"
              placeholder="you@example.com"
              {...register('email')}
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <span className="text-red-500 text-sm mt-1  ml-2">{errors.email.message}</span>}
          </div>
          <div className="relative">
            <label htmlFor="password" id="login-label">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="login-password"
              placeholder="••••••••"
              {...register('password')}
              className={`form-input ${errors.password ? 'border-red-500' : ''}`}
            />
            <span id="password-toggle" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="text-red-500 text-sm mt-1 -mb-3 ml-2">{errors.password.message}</p>}
          </div>
          <div id="login-links">
            <Link to="/forgot-password" className="items-center" id="login-forgot-password">Forgot password?</Link>
          </div>
          <button type="submit" id="login-button">Sign In</button>
        </form>
        <div id="login-signup">
          <p>New user? <Link to="/signup" id="login-signup-link">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

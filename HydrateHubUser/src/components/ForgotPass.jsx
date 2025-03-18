import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      localStorage.setItem('vemail', data.email);
      const response = await axios.post('http://localhost:3001/user/request-reset-password', {
        email: data.email,
      });
      if (response.status === 200) {
        toast.success('Verification pin sent! Check your email.', {
          onClose: () => {
            setIsSubmitting(false);
            navigate('/verify')
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send verification pin. Please try again.';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div id="login-container" className="min-h-screen z-0 flex flex-col justify-center items-center">
      <div id="forgot-password-box" className="w-96 z-10 bg-gray-200 p-8 shadow-md rounded">
        <ToastContainer /> {/* Toast notifications */}
        <div id="forgot-password-logo" className="flex justify-center mb-4">
          <Link to="/">
            <img src={'assets/logo.png'} alt="Logo" className="h-12" />
          </Link>
        </div>
        <h1 id="forgot-password-title" className="text-2xl font-semibold text-center mb-6">Forgot Password</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address to receive a 6-digit verification pin.
        </p>
        <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 mt-4 text-white rounded ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Verification Pin'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

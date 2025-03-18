import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:3001/user/reset-password', {
        newPassword: data.newPassword,
        email: localStorage.getItem('vemail')
      });

      if (response.status === 200) {
        toast.success('Password reset successful!', {
          onClose: () => {
            localStorage.removeItem('vemail');
            localStorage.removeItem('vpurpose');
            navigate('/login'); // Navigate to login page
          },
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div id="login-container" className="min-h-screen z-0 flex flex-col justify-center items-center">
      <div id="reset-password-box" className="w-96 z-10 bg-gray-200 p-8 shadow-md rounded">
        <ToastContainer /> {/* Toast notifications */}
        <div id="reset-password-logo" className="flex justify-center mb-4">
          <Link to="/">
            <img src={'assets/logo.png'} alt="Logo" className="h-12" />
          </Link>
        </div>
        <h1 id="reset-password-title" className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
        <form id="reset-password-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              {...register('newPassword')}
              placeholder="Enter new password"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
              placeholder="Confirm new password"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 mt-4 text-white rounded ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;

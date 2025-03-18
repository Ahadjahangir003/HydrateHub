import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

// Validation Schema
const schema = yup.object().shape({
    oldPassword: yup.string().required('Old password is required'),
    newPassword: yup
        .string()
        .min(8, 'New password must be at least 8 characters')
        .required('New password is required'),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm new password is required'),
});

const ChangePass = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('vendorToken');

            await axios.patch(
                'http://localhost:3001/user/change-password-vendor',
                {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Password changed successfully');
            navigate('/user-profile'); // Navigate to user profile after successful change
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(
                error.response?.data?.message || 'Failed to change password'
            );
        }
    };

    const handleGoBack = () => {
        navigate('/vendor-profile'); // Navigate back to user profile
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'old') setShowOldPassword(!showOldPassword);
        if (field === 'new') setShowNewPassword(!showNewPassword);
        if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="bg-gray-100 h-full pt-1 flex flex-col items-center justify-center">
            <div className="my-4 bg-gradient-to-r from-blue-500 w-11/12 to-indigo-300 p-10 rounded-lg shadow-lg">
                <h1 className="text-center text-3xl text-white font-semibold">
                    Change Password
                </h1>
            </div>
            <div className="my-3 bg-gradient-to-r from-blue-500 to-indigo-300 p-10 rounded-lg shadow-lg w-11/12 self-center">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center">
                        {/* Old Password Field */}
                        <div className="relative w-1/2 mx-auto">
                            <label
                                htmlFor="oldPassword"
                                className="text-white font-semibold"
                            >
                                Old Password
                            </label>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                id="oldPassword"
                                {...register('oldPassword')}
                                className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${
                                    errors.oldPassword
                                        ? 'border-red-500'
                                        : 'focus:border-blue-800'
                                }`}
                            />
                            <p className="text-red-500 text-sm">
                                {errors.oldPassword?.message}
                            </p>
                            <div
                                className="absolute top-12 right-4 cursor-pointer text-gray-600"
                                onClick={() => togglePasswordVisibility('old')}
                            >
                                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div className="relative w-1/2 mx-auto">
                            <label
                                htmlFor="newPassword"
                                className="text-white font-semibold"
                            >
                                New Password
                            </label>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id="newPassword"
                                {...register('newPassword')}
                                className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${
                                    errors.newPassword
                                        ? 'border-red-500'
                                        : 'focus:border-blue-800'
                                }`}
                            />
                            <p className="text-red-500 text-sm">
                                {errors.newPassword?.message}
                            </p>
                            <div
                                className="absolute top-12 right-4 cursor-pointer text-gray-600"
                                onClick={() => togglePasswordVisibility('new')}
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {/* Confirm New Password Field */}
                        <div className="relative w-1/2 mx-auto">
                            <label
                                htmlFor="confirmNewPassword"
                                className="text-white font-semibold"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmNewPassword"
                                {...register('confirmNewPassword')}
                                className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${
                                    errors.confirmNewPassword
                                        ? 'border-red-500'
                                        : 'focus:border-blue-800'
                                }`}
                            />
                            <p className="text-red-500 text-sm">
                                {errors.confirmNewPassword?.message}
                            </p>
                            <div
                                className="absolute top-12 right-4 cursor-pointer text-gray-600"
                                onClick={() => togglePasswordVisibility('confirm')}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-3/6 mt-4">
                            {/* Go Back Button */}
                            <button
                                type="button"
                                onClick={handleGoBack}
                                className="bg-gradient-to-b p-2 from-teal-400 to-blue-600 text-white rounded-full hover:scale-105"
                            >
                                Go Back
                            </button>
                            {/* Change Password Button */}
                            <button
                                type="submit"
                                className="bg-gradient-to-b p-2 from-teal-400 to-blue-600 text-white rounded-full hover:scale-105"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePass;

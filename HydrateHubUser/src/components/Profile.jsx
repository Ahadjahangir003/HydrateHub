import { yupResolver } from '@hookform/resolvers/yup';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCartArrowDown, FaClipboard, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Cart from './Cart';
import History from './History';
// Yup Validation Schema
const schema = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    phone: yup
        .string()
        .matches(/^\d{10,11}$/, 'Phone number must be 10-11 digits long')
        .required('Phone number is required'),
});
const stripePromise = loadStripe("pk_test_51PNfgJEvDKexXb1htqRDIS3KgfsHe8UnTUSg9DZBbfnRBjukPt6dg0XaFjb7YPMAbvGTfeoN4wS3g8EV5aVol5JO00yp9acUXQ");

const Drawer = ({ isOpen, onClose, children }) => {
    return (
        <div
            className={`fixed inset-0 z-50 overflow-y-auto overflow-ellipsis transition-transform duration-300 ${
                isOpen ? 'visible' : 'invisible'
            }`}
            style={{
                transform: isOpen
                    ? 'translateX(0)'
                    : 'translateX(100%)',                     
            }}
        >
            <div
                className={`fixed ${
                    'right-0' 
                } md:w-4/6 lg:w-3/6 h-full  bg-white z-50 py-4 px-3 overflow-y-auto w-full sm:h-auto `}
            >
                <button
                    className="fixed top-5 z-50 text-gray-600 hover:text-black"
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>
                {children}
            </div>
            <div
                className="fixed inset-0 bg-transparent bg-opacity-50"
                onClick={onClose}
            ></div>
        </div>
    );
};

const Profile = () => {
    const [refresh, setRefresh] = useState(false); // State to trigger re-renders
    const [refresh1, setRefresh1] = useState(false); // State to trigger re-renders
    const [data, setData] = useState();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const decodedToken = jwtDecode(token);

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/user/user/${decodedToken.userId}`);
                setData(response.data);
                setValue('name', response.data.name || '');
                setValue('phone', response.data.phone || '');
                setValue('address', response.data.address || '');
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, [setValue, refresh, refresh1]);


        const deleteFromCart =async(data,index)=>{
            const token = localStorage.getItem('userToken');
            const decodedToken = jwtDecode(token);
            try {
                if (data[index].type==='Product'){
                    const quantity=data[index].quantity;
                    const response =await axios.patch(`http://localhost:3001/product/edit-stock-return/${data[index].pId}`,{quantity})   
                    console.log(response)
                }
                const response = await axios.patch(`http://localhost:3001/user/delete-from-cart/${decodedToken.userId}`,{index},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log(response)
                setRefresh((prev) => !prev); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        const orderCompleted =async()=>{
            const token = localStorage.getItem('userToken');
            const decodedToken = jwtDecode(token);
            try {
            const response1 = await axios.patch(`http://localhost:3001/user/order-completed/${decodedToken.userId}`,);
            console.log(response1);
            setRefresh1((prev) => !prev);         
            } catch (error) {
                console.error('Error completing data:', error);
            }
        };


    const onSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('userToken');
            const decodedToken = jwtDecode(token);

            await axios.patch(`http://localhost:3001/user/userUpdate/${decodedToken.userId}`, formData);
            toast.success('User info updated successfully');
        } catch (error) {
            console.error('Error updating user info:', error);
            toast.error('Error updating user info');
        }
    };

    const handleChangePassword = () => {
        navigate('/change-password'); // Navigate to the change password page
    };

    return (
        <div className="bg-gray-100 h-full pt-1 flex flex-col items-center justify-center">
            <div className="my-4 bg-gradient-to-r from-blue-500 w-9/12 to-indigo-300 p-10 rounded-lg shadow-lg">
                <h1 className="text-center text-3xl text-white font-semibold">User Profile</h1>
            </div>
            <div className="my-3 bg-gradient-to-r from-blue-500 to-indigo-300 pb-10 rounded-lg shadow-lg w-9/12 self-center">
                <div className='flex-row flex gap-6 content-end justify-end border-b p-3 pr-10 mb-5 border-gray-300'>
                    <div className='w-full text-white'><marquee>Welcome {data?.name || 'User'}!</marquee> </div>
                    <button className='text-white text-3xl hover:scale-110 duration-300' onClick={() => setIsHistoryOpen(true)}>
                        <FaClipboard />
                    </button>
                    <button className='text-white text-3xl hover:scale-110 duration-300 relative' onClick={() => setIsCartOpen(true)}>
                        <FaCartArrowDown />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                            {data?.cart?.length || 0}
                        </span>
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-10 pt-2">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="text-white font-semibold">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                {...register('name')}
                                className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${
                                    errors.name ? 'border-red-500' : 'focus:border-blue-800'
                                }`}
                            />
                            <p className="text-red-500 text-sm">{errors.name?.message}</p>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="text-white font-semibold">
                                Email
                            </label>
                            <input
                                disabled
                                type="email"
                                id="email"
                                className="w-full py-2 px-4 my-2 rounded-lg focus:outline-none focus:border-blue-800 border-2"
                                value={data ? data.email : 'user@gmail.com'}
                            />
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="text-white font-semibold">
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                {...register('phone')}
                                className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${
                                    errors.phone ? 'border-red-500' : 'focus:border-blue-800'
                                }`}
                            />
                            <p className="text-red-500 text-sm">{errors.phone?.message}</p>
                        </div>

                        {/* Address Field */}
                        <div>
                            <label htmlFor="address" className="text-white font-semibold">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                {...register('address')}
                                className={`w-full py-2 px-4 my-2 bg-gray-200 rounded-lg focus:outline-none border-2 ${
                                    errors.address ? 'border-red-500' : 'focus:border-blue-800'
                                }`}
                            />
                            <p className="text-red-500 text-sm">{errors.address?.message}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-3/6 mt-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-b p-2 from-teal-400 to-blue-600 text-white rounded-full hover:scale-105"
                            >
                                Update Info
                            </button>
                            <button
                                type="button"
                                onClick={handleChangePassword}
                                className="bg-gradient-to-b p-2 from-teal-400 to-blue-600 text-white rounded-full hover:scale-105"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </form>
                <Drawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}>
                <h2 className="text-lg text-center font-semibold border-b border-gray-500 mb-2">Cart</h2>
                <Elements stripe={stripePromise}>
                <Cart data={data?.cart} deleteFromCart={deleteFromCart} orderCompleted={orderCompleted}/>
                </Elements>
                </Drawer>
                <Drawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)}>
                <h2 className="text-lg text-center font-semibold border-b border-gray-500 mb-2">History</h2>
                <History/>
                </Drawer>

            </div>
        </div>
    );
};

export default Profile;

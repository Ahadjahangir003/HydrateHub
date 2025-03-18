import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';

const History = () => {
    const [data, setData]=useState();
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const decodedToken = jwtDecode(token);

        const fetchUserHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/order/user-orders/${decodedToken.userId}`);
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserHistory();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
      };
    

    return (
        <div className="w-full min-h-screen bg-gradient-to-b flex flex-col items-center from-blue-500 to-teal-500 rounded-md p-4">
            {data?.map((history)=>(
                <div className="w-11/12 rounded-lg gap-2 flex mb-2 flex-row bg-gray-300 py-2 pr-8 pl-2">
            <div className='w-3/6'>
                    <h1 className='text-sm px-1 rounded-md bg-blue-600 mb-1 text-white'>Order Date: <b>{formatDate(history.createdAt)}</b></h1>
                    <h1 className='text-sm px-1 rounded-md bg-blue-600 mb-1 text-white'>Ordered By: <b>{history.user}</b></h1>
                    <h1 className={`text-sm px-1 rounded-md ${history.status==='Completed'? 'bg-green-600':'bg-red-600'} mb-1 text-white`}>Delivery Status: <b>{history.status}</b></h1>
            </div>
            <div className='w-3/6'>
                    <h1 className='text-sm px-1 rounded-md bg-blue-600 mb-1 text-white'>Title: <b>{history.p}</b></h1>
                    <h1 className='text-sm px-1 rounded-md bg-blue-600 mb-1 text-white'>Price: <b>{history.price}</b></h1>
                    {history.quantity && (
              <h1 className='text-sm px-1 rounded-md bg-blue-600 mb-1 text-white'>
                Quantity: <b>{history.quantity}</b>
              </h1>
)}
                    <h1 className='text-sm px-1 rounded-md bg-blue-600 mb-1 text-white'>Vendor: <b>{history.vendor}</b></h1>
            </div>
                </div>

            ))}
        </div>
    );
};

export default History;
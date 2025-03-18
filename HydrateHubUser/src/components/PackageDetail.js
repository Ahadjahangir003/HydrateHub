import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCartPlus, FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
import '../styles/index.css'; // Import for external CSS
import StarRating from './StarRating';


function PackageDetail() {
  const { id } = useParams(); // Get package ID from URL params
  const [cpackage, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isRatingFormOpen, setIsRatingFormOpen] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('userToken');
  const loggedIn = token? true :false;

    const ratingValidationSchema = yup.object().shape({
      comment: yup
        .string()
        .required('Comment is required')
        .max(500, 'Comment must be under 500 characters'),
    });
  
      const {
        register: ratingRegister,
        handleSubmit: handleRatingSubmit,
        formState: { errors: ratingErrors },
        reset: resetRatingForm,
      } = useForm({
        resolver: yupResolver(ratingValidationSchema),
        mode: 'onChange',
      });
    

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/package/single-package/${id}`);
        setPackage(response.data);
        const response1 =await axios.get(
          `http://localhost:3001/rating/get-rating/${id}`
        );
        setRatings(response1.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching package details.');
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);


  const handleRatingFormOpen = () => {
    if (!loggedIn) {
      toast.info('You are not Logged in, Login to Rate Product.');
      return;
    }
    setIsRatingFormOpen(true);
  };

  const AddtoCart = async () => {
        if (!loggedIn){
          toast.info('You are not Logged in, Login to Use Cart.')
          return;
        }
    else{

      const token = localStorage.getItem('userToken');
      const decodedToken = jwtDecode(token);
    const cartOrder={
      pId:cpackage._id,
      userId: decodedToken.userId,
      vendorId:cpackage.vendorId,
      p:cpackage.title,
      user:decodedToken.name,
      vendor:cpackage.vendor,
      status:'Pending',
      userEmail:decodedToken.userEmail,
      quantity:null,
      price:cpackage.price,
      type:'Package',
      image:cpackage.image
    }
    console.log(cartOrder)
    try {
      const response = await axios.patch(`http://localhost:3001/user/add-to-cart/${decodedToken.userId}`, {
        cartOrder,
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
  console.log(response);        
  toast.success('Added to cart successfully!')
} catch (error) {
  toast.error('Failed to Add to Cart!')
}
}
};

const onSubmitRating = async (data) => {
  try {
    const decodedToken = jwtDecode(token);
    const ratingData = {
      pId: cpackage._id,
      p:cpackage.title,
      userId: decodedToken.userId,
      user: decodedToken.name,
      rating: selectedRating,
      review: data.comment,
    };

    await axios.put('http://localhost:3001/rating/save-rating', ratingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Rating submitted successfully!');
    setIsRatingFormOpen(false);
    resetRatingForm();
    setSelectedRating(0); 
  } catch (error) {
    toast.error('Failed to submit rating!');
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div id="cpackage-details-container" className="flex flex-col min-h-screen">
      {/* Image Section */}
      <div
        id="cpackage-image-section"
        className="relative w-full h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${`http://localhost:3001/uploads/${cpackage.image}` || 'https://via.placeholder.com/150'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl text-gray-50 font-bold">{cpackage.title}</h1>
        </div>
      </div>

      {/* Package Details Section */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package Description and Features */}
        <div className="lg:col-span-2">
          <div className='flex justify-center'>
            <img
              className='h-96 w-10/12 rounded-lg '
              alt={cpackage.title}
              src={`http://localhost:3001/uploads/${cpackage.image}`}
            />
          </div>
          <h1 className='text-gray-800 text-center font-semibold'>{cpackage.title}</h1>
          <h2 className="text-2xl font-bold text-center mb-4">Package Details</h2>
          <p className="mb-6 text-center">
            {cpackage.details || 'This is a default description because the package does not have one.'}
          </p>
        </div>

        {/* Sidebar with Price and Stock Info */}
        <div id="cpackage-sidebar" className="bg-white p-6 shadow-lg rounded-lg">
          <div className='bg-gradient-to-b from-teal-200  to-blue-500 text-white rounded-lg p-4'>
            <h1 className='text-center text-xl font-semibold'>Vendor Details</h1>
            <p className="mb-2 mt-5">
              <strong>Vendor:</strong> {cpackage.vendor || 'Default Vendor'}
            </p>
            <p className="mb-4">
              <strong>Vendor Email:</strong> {cpackage.vendorEmail || 'Vendor@gmail.com'}
            </p>
          </div>
          <div className='bg-gradient-to-b from-teal-200  to-blue-500 text-white rounded-lg p-4 mt-6'>
            <h1 className='text-center text-xl font-semibold'>Package</h1>
            <h3 className="mb-4 mt-5">Price: {cpackage.price} PKR</h3>
          </div>
          <button
            className="w-full flex hover:scale-95 duration-300  items-center justify-center flex-row gap-2 bg-gradient-to-r from-teal-200  to-blue-500 text-white py-2 px-4 rounded-full mt-6 hover:bg-blue-600"
            onClick={() => AddtoCart()}
          >
            Add to Cart <FaCartPlus/>
          </button>
          <button className="w-full flex hover:scale-95 duration-300  items-center justify-center flex-row gap-2 bg-gradient-to-r from-blue-400  to-teal-300 text-white py-2 px-4 rounded-full mt-6 hover:bg-blue-600"
            onClick={() => handleRatingFormOpen()}
          >Rate Package <FaStar/> </button>

                    <div className="mb-8 mt-9 bg-gradient-to-b from-teal-200  to-blue-500 text-white rounded-lg p-4">
                      <h3 className="text-xl text-center font-bold border-b border-gray-300 !text-white">Customer Reviews</h3>
                        {ratings && ratings.map((rating)=>(
                            <div className='bg-sky-300 rounded-md text-center p-2 shadow-xl mb-2'>
                              <p><b>{rating.user}:</b></p>
                              <p>"{rating.review}"</p>
                              <p className='border-t border-gray-300'><StarRating rating={rating.rating}/></p>
                            </div>
                        ))}
                        {ratings.length===0 &&
                        <p className='text-center'>No Ratings</p>
                        }
                    </div>
          
        </div>
      </div>

      {isRatingFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-500">Rate Package</h2>
            <form
              onSubmit={handleRatingSubmit(onSubmitRating)}
              className="flex flex-col gap-2"
            >
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={30}
                    className={`cursor-pointer ${
                      selectedRating >= star
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setSelectedRating(star)}
                  />
                ))}
              </div>
              {ratingErrors.rating && (
                <p className="text-red-500 text-sm">{ratingErrors.rating.message}</p>
              )}

              <label className="block font-semibold mb-1">Comment</label>
              <textarea
                {...ratingRegister('comment')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                rows="4"
              />
              {ratingErrors.comment && (
                <p className="text-red-500 text-sm">
                  {ratingErrors.comment.message}
                </p>
              )}

              <div className="flex gap-2 mt-4 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRatingFormOpen(false);
                    resetRatingForm();
                    setSelectedRating(0);
                  }}
                  className="bg-red-500 text-white px-4 py-1 w-1/5 rounded-full hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-1 w-1/5 rounded-full hover:bg-green-600"
                >
                  Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default PackageDetail;

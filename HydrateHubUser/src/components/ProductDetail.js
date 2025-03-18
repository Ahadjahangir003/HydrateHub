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

function ProductDetail() {
  const { id } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isRatingFormOpen, setIsRatingFormOpen] = useState(false);
  const token = localStorage.getItem('userToken');
  const loggedIn = token ? true : false;

  const quantityValidationSchema = yup.object().shape({
    quantity: yup
      .number()
      .min(1, 'Quantity must be at least 1')
      .required('Quantity is required'),
  });

  const ratingValidationSchema = yup.object().shape({
    comment: yup
      .string()
      .required('Comment is required')
      .max(500, 'Comment must be under 500 characters'),
  });

  const {
    register: quantityRegister,
    handleSubmit: handleQuantitySubmit,
    formState: { errors: quantityErrors },
    reset: resetQuantityForm,
  } = useForm({
    resolver: yupResolver(quantityValidationSchema),
    mode: 'onChange',
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
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/product/single-product/${id}`
        );
        setProduct(response.data);
        const response1 =await axios.get(
          `http://localhost:3001/rating/get-rating/${id}`
        );
        setRatings(response1.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching product details.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, quantity]);

  const handleFormOpen = () => {
    if (!loggedIn) {
      toast.info('You are not Logged in, Login to Use Cart.');
      return;
    }
    setIsFormOpen(true);
  };

  const handleRatingFormOpen = () => {
    if (!loggedIn) {
      toast.info('You are not Logged in, Login to Rate Product.');
      return;
    }
    setIsRatingFormOpen(true);
  };

  const onSubmitQuantity = async (data) => {
    const decodedToken = jwtDecode(token);
    const cartOrder = {
      pId: product._id,
      userId: decodedToken.userId,
      vendorId: product.vendorId,
      p: product.title,
      user: decodedToken.name,
      vendor: product.vendor,
      status: 'Pending',
      userEmail: decodedToken.userEmail,
      quantity: data.quantity,
      price: product.price,
      type: 'Product',
      image: product.image,
    };
    try {
      await axios.patch(
        `http://localhost:3001/user/add-to-cart/${decodedToken.userId}`,
        { cartOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFormOpen(false);
      await axios.patch(
        `http://localhost:3001/product/edit-stock/${product._id}`,
        { quantity: data.quantity }
      );
      toast.success('Added to cart successfully!');
      resetQuantityForm();
      setQuantity(0);
    } catch (error) {
      toast.error('Failed to Add to Cart!');
    }
  };

  const onSubmitRating = async (data) => {
    try {
      const decodedToken = jwtDecode(token);
      const ratingData = {
        pId: product._id,
        p:product.title,
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
    <div id="product-details-container" className="flex flex-col min-h-screen">
      {/* Image Section */}
      <div
        id="product-image-section"
        className="relative w-full h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${`http://localhost:3001/uploads/${product.image}` || 'https://via.placeholder.com/150'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl text-center text-gray-50 font-bold">{product.title}</h1>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Description and Features */}
        <div className="lg:col-span-2">
          <div className='flex justify-center'>
            <img
            className='h-96 w-10/12 rounded-lg '
            src={`http://localhost:3001/uploads/${product.image}`}
            alt={product.title}
            />
          </div>
          <h1 className='text-gray-800 text-center font-semibold'>{product.title}</h1>
          <h2 className="text-2xl font-bold text-center mb-4">Product Details</h2>
          <p className="mb-6 text-center">
            {product.details || 'This is a default description because the product does not have one.'}
          </p>

          {/* Product Features */}
          <div className="mb-8">
            <h3 className="text-xl font-bold">Product Features</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>High-quality materials and long-lasting durability</li>
              <li>Easy to install and maintain</li>
              <li>Energy-efficient technology for lower power consumption</li>
              <li>Comes with a 1-year warranty</li>
              <li>Available in multiple sizes and colors</li>
            </ul>
          </div>

          {/* Shipping Information */}
          <div className="mb-8">
            <h3 className="text-xl font-bold">Shipping Information</h3>
            <p>
              Free shipping is available for all orders over 2000 PKR. Orders are processed within 1-2 business days and
              shipped via reputable courier services. Delivery typically takes 3-5 business days. For express shipping,
              additional charges may apply.
            </p>
          </div>

          {/* Return Policy */}
          <div className="mb-8">
            <h3 className="text-xl font-bold">Return Policy</h3>
            <p>
              We offer a 30-day return policy for all unused and undamaged products. If you're not completely satisfied,
              return the product in its original packaging for a full refund or exchange. Return shipping charges may
              apply.
            </p>
          </div>

          {/* Customer Reviews */}
        </div>

        {/* Sidebar with Price and Stock Info */}
        <div id="product-sidebar" className="bg-white p-6 shadow-lg rounded-lg">
          <div className='bg-gradient-to-b from-teal-200  to-blue-500 text-white rounded-lg p-4'>
            <h1  className='text-center text-xl font-semibold'>Vendor Details</h1>
            <p className="mb-2 mt-5">
            <strong>Vendor:</strong> {product.vendor || 'Default Vendor'}
          </p>
            <p className="mb-4">
            <strong>Vendor Email:</strong> {product.vendorEmail || 'Vendor@gmail.com'}
          </p>

          </div>
          <div className='bg-gradient-to-b from-teal-200  to-blue-500 text-white rounded-lg p-4 mt-6'>
            <h1  className='text-center text-xl font-semibold'>Product</h1>
            <h3 className=" mb-4 mt-4"> Bottle Price: {product.price} PKR</h3>
          <p className="mb-4">
            <strong>Reamining Stock:</strong> {product.stock || 'Out of Stock'}
          </p>

          </div>
          <button className="w-full flex hover:scale-95 duration-300  items-center justify-center flex-row gap-2 bg-gradient-to-r from-teal-200  to-blue-500 text-white py-2 px-4 rounded-full mt-6 hover:bg-blue-600"
            onClick={() => handleFormOpen()}
          >Add to Cart <FaCartPlus/> </button>
          <button className="w-full flex hover:scale-95 duration-300  items-center justify-center flex-row gap-2 bg-gradient-to-r from-blue-400  to-teal-300 text-white py-2 px-4 rounded-full mt-6 hover:bg-blue-600"
            onClick={() => handleRatingFormOpen()}
          >Rate Product <FaStar/> </button>
          <div className="mb-8 mt-9 bg-gradient-to-b from-teal-200  to-blue-500 text-white rounded-lg p-4">
            <h3 className="text-xl text-center font-bold border-b border-gray-300 !text-white">Customer Reviews</h3>
              {ratings.map((rating)=>(
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
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Set Quantity</h2>
            <form
              onSubmit={handleQuantitySubmit(onSubmitQuantity)}
              className="flex flex-col gap-2"
            >
              <label className="block font-semibold mb-1">Quantity</label>
              <input
                type="number"
                {...quantityRegister('quantity')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                min="1"
                max={product.stock}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {quantityErrors.quantity && (
                <p className="text-red-500 text-sm">
                  {quantityErrors.quantity.message}
                </p>
              )}
              <h1 className="text-center">
                Total Price: {quantity * product.price || '0'}
              </h1>
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetQuantityForm();
                    setQuantity(0);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600"
                >
                  Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRatingFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-500">Rate Product</h2>
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

export default ProductDetail;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Packages from '../components/Packages';
import Products from '../components/Products';
import '../styles/index.css'; // Import for external CSS

function VendorDetail() {
  const { id } = useParams(); // Get vendor ID from URL params
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [listType, setListType]=useState('products')
  const productApi=`http://localhost:3001/product/vendor-products/${id}`
  const packageApi=`http://localhost:3001/package/vendor-packages/${id}`
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/partner/${id}`);
        setVendor(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching vendor details.');
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div id="vendor-details-container" className="flex flex-col min-h-screen">
      {/* Image Section */}
      <div
        id="vendor-image-section"
        className="relative w-full h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${'/images/water11.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl text-gray-50 font-bold">{vendor.companyName}</h1>
        </div>
      </div>

      <div className='w-full flex flex-col gap-4 !justify-center items-center mt-4 p-4'>

        <div className='w-full lg:w-4/6 bg-slate-200 h-fit rounded-xl p-4 items-center flex flex-col justify-center '>
          <img alt='companyLogo' src={vendor.image? `http://localhost:3001/uploads/${vendor.image}`: '/assets/DefaultCompany.png'} className=' w-24 rounded-full ' />
          <h1 className='text-center font-semibold text-xl text-gray-800'>{vendor.companyName}</h1>
          <h1 className='text-center text-gray-700 text-lg'>Office: {vendor.location}</h1>
          <h1 className='text-center text-gray-700 text-lg'>About: {vendor.about || 'This is default about of vendor whose Details are not added.'}</h1>
        </div>

        <div className='w-full lg:w-4/6 bg-slate-200 h-fit rounded-xl p-4 '>
          <h1 className='text-center text-gray-800 text-xl'>Owner Details & Contact</h1>
          <h1 className='text-center text-gray-700 text-lg'>Owner:<br></br> {vendor.name}</h1>
          <h1 className='text-center text-gray-700 text-lg'>Phone:<br></br> {vendor.phone}</h1>
          <h1 className='text-center text-gray-700 text-lg'>Contact Email:<br></br> {vendor.email}</h1>
        </div>

      </div>

      <div id="login-switch" className="flex justify-center mb-4">
          <button
            className={`px-3 py-2 w-1/6 rounded-l-xl ${listType === 'products' ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setListType('products')}
          >
            Products
          </button>
          <button
            className={`px-6 py-2 w-1/6 rounded-r-xl ${listType === 'packages' ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setListType('packages')}
          >
            Packages  
          </button>
        </div>

        <div className=''>
          {listType==='products' &&
          <>
          <h1 className='p-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-center font-semibold text-xl'>Products by {vendor.companyName}</h1>
          <Products api={productApi}/>
          </>
          }
          {listType==='packages' &&
          <>
          <h1 className='p-2 bg-gradient-to-r to-blue-500 from-teal-500 text-white text-center font-semibold text-xl'>Packages by {vendor.companyName}</h1>
          <Packages api={packageApi}/>
          </>
          }
        </div>

    </div>
  );
}

export default VendorDetail;

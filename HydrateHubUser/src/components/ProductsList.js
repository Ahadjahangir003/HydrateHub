import React from 'react';
import '../styles/index.css'; // Import the external CSS file
import Products from './Products';

function ProductsList() {
  const productApi='http://localhost:3001/product/all-products-user'

 

  return (
    <div id="vendors-container" className="flex flex-col min-h-screen">
    {/* Top Section */}
    <div id="vendors-image-section" className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: `url('/images/water11.jpg')` }}>
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
          Product List
        </h1>
      </div>
    </div>
    <Products api={productApi} />
    </div>
  );
}

export default ProductsList;

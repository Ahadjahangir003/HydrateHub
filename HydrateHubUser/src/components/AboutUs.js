import React from 'react';
import '../styles/index.css'; // Assuming global styles or additional styles
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div id="vendors-container" className="flex flex-col min-h-screen">
      {/* Top Section */}
      <div id="vendors-image-section" className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: `url('/images/water11.jpg')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
            About HydrateHub
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 text-center">
            Delivering Fresh and Filtered Water, Direct to Your Doorstep.
          </p>
        </div>
      </div>
 
      <section id="mission" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            At HydrateHub, our mission is simple: to provide fresh, filtered water directly to your doorstep. We aim to ensure that everyone has access to clean and safe water, delivered in a way that’s convenient, sustainable, and trustworthy.
          </p>
        </div>
      </section>

      {/* Company History Section */}
      <section id="history" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            Our Story
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 text-center mb-6">
            HydrateHub started in 2015 with a simple idea: to provide easy access to clean water to communities across the nation. What started as a small initiative to help underserved areas with clean water has now grown into a full-scale service with hundreds of vendors, delivering fresh, filtered water to thousands of homes every day.
          </p>
          <p className="text-lg sm:text-xl text-gray-600 text-center">
            Today, we continue to innovate and expand, with a focus on sustainability and customer satisfaction. We’re proud to have served over a million liters of water and remain committed to keeping our customers hydrated and healthy.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="values" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We are committed to sustainable water sourcing and minimizing our environmental impact through eco-friendly packaging and efficient delivery routes.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Quality</h3>
              <p className="text-gray-600">
                Every drop of water we deliver is filtered, tested, and certified to meet the highest standards of safety and quality.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Trust</h3>
              <p className="text-gray-600">
                We work only with trusted vendors and maintain strict quality control to ensure you get the best water possible every time.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action Section */}
      <section id="call-to-action" style={{backgroundColor:"#024950", borderRadius:"10px"}} className="py-16 mx-4 text-white">
        <div className=" px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Join Us in Creating a Healthier, Hydrated World
          </h2>
          <p style={{color:"white"}} className="text-lg mb-6">
            Whether you're a vendor looking to partner with us or a customer wanting to enjoy our service, we’re excited to work with you!
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            Get Started Today
          </Link>

        </div>
      </section>
      <br></br>
    </div>
  );
};

export default AboutUs;
     

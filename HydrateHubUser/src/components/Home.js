import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import '../styles/index.css';

const StatisticsSection = () => (
    <div id="statistics-section" className="py-16 flex flex-col lg:flex-row bg-blue-50">
        <div className=' p-6 items-center flex justify-items-center justify-center lg:w-3/6'>
            <img src='/assets/Bottle.jpg' className=' lg:w-full w-5/6 rounded-lg' alt='bottle' />
        </div>
        <div className="container lg:w-3/6 px-6 text-center lg:mt-16 ">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                HydrateHub in Numbers
            </h2>
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-gradient-to-b from-teal-200 to-blue-500  shadow-md rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4 ">4+</h3>
                    <p className="">Vendors partnered with HydrateHub</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 bg-gradient-to-b from-teal-200 to-blue-500">
                    <h3 className="text-2xl  font-semibold mb-4">5K+</h3>
                    <p className="">Liters of water delivered to customers</p>
                </div>
                <div className="bg-gradient-to-b from-teal-200 to-blue-500  shadow-md rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4 ">40+</h3>
                    <p className="">Variety of Products and Packages</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 bg-gradient-to-b from-teal-200 to-blue-500">
                    <h3 className="text-2xl font-semibold  mb-4">99%</h3>
                    <p className="">Customer satisfaction rate</p>
                </div>
            </div>
        </div>
    </div>
);

const TestimonialsSection = () => (
    <div id="testimonials-section" className="py-16 flex w-full flex-col gap-4 lg:flex-row bg-gray-100">
        <div className="container mx-auto text-center lg:w-3/6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">What Our Customers Say</h2>
            <div className="grid grid-cols-1 px-6 gap-8">
                <div className="bg-gradient-to-b from-teal-200 to-blue-500 shadow-md rounded-lg px-6 py-3">
                    <h4 className="mt-2 text-lg  font-semibold">Ahmad.</h4>
                    <p className=" italic">
                        "HydrateHub has made it so easy to get clean water. I love the fast delivery!"
                    </p>
                </div>
                <div className="bg-gradient-to-b from-teal-200 to-blue-500 shadow-md rounded-lg px-6 py-3">
                    <h4 className="mt-2 text-lg font-semibold ">Asad.</h4>
                    <p className=" italic">
                        "I trust HydrateHub vendors for my family’s health. The water quality is top-notch!"
                    </p>
                </div>
                <div className="bg-gradient-to-b from-teal-200 to-blue-500 shadow-md rounded-lg px-6 py-3">
                    <h4 className="mt-2 text-lg font-semibold ">- Ahad Jahangir.</h4>
                    <p className=" italic">
                        "The service is amazing, and the water is always fresh. Highly recommend."
                    </p>
                </div>
            </div>
        </div>
        <div className=' flex justify-center  items-center content-center lg:w-3/6 px-6'>
        <img src='/assets/Bottle1.jpg' alt='Bottle' className='lg:w-full w-5/6 rounded-lg'/>
        </div>
    </div>
);


const Home = () => {

    const [vendors, setVendors]= useState([]);
    const hasErrorRef = useRef(false);
    useEffect(() => {
      const fetchVendors = async () => {
        try {
          const response = await axios.get("http://localhost:3001/admin/partners", {
          });
          setVendors(response.data || []);
          hasErrorRef.current = false; // Reset the error state on successful fetch
        } catch (error) {
          console.error("Error fetching vendors:", error);
          if (!hasErrorRef.current) {
            toast.error("Failed to fetch vendor data!"); // Show toast only once
            hasErrorRef.current = true; // Set the error state to true after showing the toast
          }
        }
      };
  
      fetchVendors();
    }, []);  

    
    const VendorSection = () => (
        <div id="vendor-section" className="py-16 bg-white">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                    Our Trusted Vendors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-6">
                    {vendors.map((vendor)=>(
    
                        <div className="bg-gradient-to-b from-teal-100 to-blue-300 shadow-md min-h-96 rounded-lg p-6">
                    <img src={vendor.image? `http://localhost:3001/uploads/${vendor.image}`: '/assets/DefaultCompany.png'} alt={vendor.companyName} className="w-full h-3/6 mb-4 rounded-lg" />
                        <h3 className="text-2xl font-semibold mb-4">{vendor.companyName}</h3>
                        <p className="text-gray-600 text-center">
                        {vendor.about || 'This is default about because vendor do not have one.'}
                        </p>
                        <p className="text-gray-600 text-center">
                            Office Address: {vendor.location}
                        </p>
                        
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );


    return (
        <div id="home-container" className="flex flex-col min-h-screen">
    {/* Hero Section with Video */}
    <div id="hero-section" className="relative w-full h-screen bg-center" style={{ height: '91vh' }}>
    <video
        id="hero-video"
        className="absolute inset-0 w-full h-full object-fill"
        src="/assets/hero-video.mp4"
        autoPlay
        loop
        muted
    />
    <div
        id="hero-overlay"
        className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center"
    >
    <div className='bg-black bg-opacity-30 mx-1 pt-6 w-full '>
<h1
            id="hero-title"
            className="text-4xl sm:text-5xl font-bold  text-white mb-4 text-center"
        >
            Clean, Fresh Water from Trusted Vendors
        </h1>
        <p
            id="hero-subtitle"
            className="text-lg sm:text-xl text-gray-200 text-center mb-6"
        >
            Discover the best filtered water solutions near you with
            HydrateHub.
        </p>

    </div>        
    </div>
</div>

            {/* Cards Section */}
            <main id="main-content" className="flex-grow py-8 bg-gray-50">
                <div id="cards-container" className="container mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                        Why Choose HydrateHub?
                    </h2>
                    <p id="intro-text" className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        HydrateHub connects you with trusted vendors, ensuring you get the best filtered water delivered directly to your home. Here's why customers love us:
                    </p>

                    <div id="cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                        {/* Card 1 */}
                        <div id="card1" className="bg-gradient-to-b from-teal-200 to-blue-500 shadow-md rounded-lg p-6">
                            <h3 className="text-2xl font-semibold mb-4">Wide Vendor Network</h3>
                            <p className="">
                                Choose from a wide variety of water vendors offering high-quality filtered water to match your preferences.
                            </p>
                        </div>
                        {/* Card 2 */}
                        <div id="card2" className="bg-gradient-to-b from-teal-200 to-blue-500 shadow-md rounded-lg p-6">
                            <h3 className="text-2xl font-semibold mb-4">Quality You Can Trust</h3>
                            <p>
                                All our vendors are vetted to provide clean, safe, and certified filtered water.
                            </p>
                        </div>
                        {/* Card 3 */}
                        <div id="card3" className="bg-gradient-to-b from-teal-200 to-blue-500 shadow-md rounded-lg p-6">
                            <h3 className="text-2xl  font-semibold mb-4">Easy, Fast Delivery</h3>
                            <p className="">
                                Convenient and fast water delivery directly to your doorstep, at a time that suits you.
                            </p>
                        </div>
                    </div>

                    {/* Join Button */}
                    <div id="join-button" className="mt-8 rounded-3xl hover:transform hover:scale-x-105 transition-transform">
                        <Link to="/signup" className="bg-gradient-to-r !rounded-3xl from-teal-200 to-blue-500 px-6 py-3 hover:bg-blue-600  font-semibold">
                            Join HydrateHub Today
                        </Link>
                    </div>
                </div>
            </main>
            <StatisticsSection />
            <TestimonialsSection />
            <VendorSection />
        </div>
    );
};

export default Home;

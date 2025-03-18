import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css'; // Import the external CSS file
import StarRating from './StarRating';

const Packages = ({ api }) => {
    const [cpackages, setPackages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState(3001); // Default to max price
    const [orderBy, setOrderBy] = useState(''); // New state for ordering

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get(api);
                setPackages(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching packages:', error.message);
            }
        };
        fetchPackages();
    }, [api]);

    // Handle the search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle the price filter input
    const handlePriceFilter = (e) => {
        setPriceFilter(e.target.value);
    };

    // Handle order by selection
    const handleOrderBy = (e) => {
        setOrderBy(e.target.value);
    };

    // Filtered and sorted packages
    const filteredPackages = cpackages
        .filter(cpackage => cpackage.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(cpackage => priceFilter ? cpackage.price <= priceFilter : true)
        .sort((a, b) => {
            if (orderBy === 'highest-rated') return b.averageRating - a.averageRating;
            if (orderBy === 'lowest-rated') return a.averageRating - b.averageRating;
            if (orderBy === 'cheapest') return a.price - b.price;
            if (orderBy === 'expensive') return b.price - a.price;
            return 0;
        });

    return (
        <div id="vendors-container" className="flex flex-col min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search packages..."
                        className="border border-gray-300 px-4 py-2 rounded-full shadow-sm w-full max-w-md mx-auto"
                        id="search-bar"
                    />
                </div>
                <div className="flex flex-wrap justify-between text-center">
                <div className="w-1/6 h-fit py-6 md:w-1/5 mb-6 bg-blue-200 mx-auto rounded-md !shadow-md !shadow-blue-700 " style={{ minWidth: '220px' }}>
                <h2 className="text-xl font-bold border-b mb-6">Filters</h2>
                        {/* Price Range Slider */}
                        <div className="mb-4 px-4">
                            <label htmlFor="price-slider" className="block text-gray-700 border-b font-bold mb-2">Price Range</label>
                            <input
                                id="price-slider"
                                type="range"
                                min="0"
                                max="3001"
                                step="100"
                                value={priceFilter}
                                onChange={handlePriceFilter}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm">
                                <span>0 PKR</span>
                                <span>3001 PKR</span>
                            </div>
                            <p className="mt-2 text-gray-700">Max Price: {priceFilter} PKR</p>
                        </div>

                        {/* Order By */}
                        <div className="mb-4 px-4">
                            <h3 className="block text-gray-700 font-bold mb-2 border-b">Order By</h3>
                            <div className="flex flex-col">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="order-by"
                                        value="highest-rated"
                                        checked={orderBy === 'highest-rated'}
                                        onChange={handleOrderBy}
                                        className="mr-2"
                                    />
                                    Highest Rated
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="order-by"
                                        value="lowest-rated"
                                        checked={orderBy === 'lowest-rated'}
                                        onChange={handleOrderBy}
                                        className="mr-2"
                                    />
                                    Lowest Rated
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="order-by"
                                        value="cheapest"
                                        checked={orderBy === 'cheapest'}
                                        onChange={handleOrderBy}
                                        className="mr-2"
                                    />
                                    Cheapest
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="order-by"
                                        value="expensive"
                                        checked={orderBy === 'expensive'}
                                        onChange={handleOrderBy}
                                        className="mr-2"
                                    />
                                    Expensive
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 text-center mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-8/12 lg:w-3/4 md:w-full">
                        {filteredPackages.length > 0 ? (
                            filteredPackages.map(cpackage => (
                                <Link
                                    to={`/package/${cpackage._id}`}  // Make entire card clickable
                                    key={cpackage._id}
                                    id="product-card"  // Use external CSS for card styling
                                    className="bg-gradient-to-b from-indigo-100 to-blue-400 p-2 rounded-lg shadow-lg"
                                >
                                    <img
                                        src={`http://localhost:3001/uploads/${cpackage.image}` || 'https://via.placeholder.com/150'}
                                        alt={cpackage.title}
                                        style={{ objectFit: "cover", height: "150px" }}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h2 className="text-lg font-semibold text-white mb-2">{cpackage.title}</h2>
                                    <p className="text-white mb-2">Price: {cpackage.price} PKR</p>
                                    <p className="text-sm text-white"><b>{cpackage.vendor}</b></p>
                                    <p className="text-sm text-yellow-400 flex items-center gap-3 justify-center">
                                        <StarRating rating={cpackage.averageRating || 0} /> ({cpackage.ratingCount || 0})
                                    </p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No packages found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Packages;

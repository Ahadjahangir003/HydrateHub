import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css'; // Import the external CSS file
import StarRating from './StarRating';

const Products = ({ api }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState(3001); // Default to max price
    const [orderBy, setOrderBy] = useState(''); // New state for ordering

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(api);
                setProducts(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };
        fetchProducts();
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

    // Filtered and sorted products
    const filteredProducts = products
        .filter(product => product.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(product => priceFilter ? product.price <= priceFilter : true)
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
                        placeholder="Search products..."
                        className="border border-gray-300 px-4 py-2 rounded-full shadow-sm w-full max-w-md mx-auto"
                        id="search-bar"
                    />
                </div>

                <div className="flex flex-wrap justify-between text-center">
                    <div className="md:w-1/5 h-fit py-6 w-1/6 mb-6 bg-blue-200 rounded-md mx-auto !shadow-md !shadow-blue-700 " style={{ minWidth: '220px' }}>
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

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto gap-5 md:w-full lg:w-3/4 w-4/6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <Link
                                    to={`/product/${product._id}`}  // Make entire card clickable
                                    key={product._id}
                                    id="product-card"  // Use external CSS for card styling
                                    className="bg-gradient-to-b from-indigo-100 to-blue-400 p-2 rounded-lg shadow-lg"
                                >
                                    <img
                                        src={`http://localhost:3001/uploads/${product.image}` || 'https://via.placeholder.com/150'}
                                        alt={product.title}
                                        style={{ objectFit: "cover", height: "150px" }}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h2 className="text-xl font-bold text-white mb-2">{product.title}</h2>
                                    <p className="text-white mb-2">Price: {product.price} PKR</p>
                                    <p className="text-white mb-4">Stock: {product.stock}</p>
                                    <p className="text-sm text-white"><b>{product.vendor}</b></p>
                                    <p className="text-sm text-yellow-400 flex items-center gap-3 justify-center"><StarRating rating={product.averageRating || 0} /> ({product.ratingCount || 0})</p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No products found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;

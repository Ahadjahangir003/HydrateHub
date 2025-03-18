import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1 justify-center">
            <span className="mt-1 text-yellow-300">{rating.toFixed(1)}</span>
            <div className="flex">
                {[...Array(fullStars)].map((_, index) => (
                    <FaStar key={index} color="yellow" />
                ))}
                {halfStar && <FaStarHalfAlt color="yellow" />}
                {[...Array(emptyStars)].map((_, index) => (
                    <FaRegStar key={index} color="yellow" />
                ))}
            </div>
        </div>
    );
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired
};

export default StarRating;

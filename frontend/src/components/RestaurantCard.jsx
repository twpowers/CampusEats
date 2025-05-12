import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {

    const formatRestaurantData = (rawRestaurant) => {
        return {
            name: rawRestaurant.RestaurantName,
            image: rawRestaurant.image,
            rating: rawRestaurant.rating,
            description: rawRestaurant.bio,
            price: rawRestaurant.price_range,
            category: rawRestaurant.category,
            dateAdded: rawRestaurant.dateAdded,
            location: rawRestaurant.location,
            hours: rawRestaurant.Hours
        };
    };

    const formattedData = formatRestaurantData(restaurant);

    const {
        name = "",
        image = "",
        rating = 0,
        description = "",
        price = "",
        category = "",
        location = "",
        hours = ""
    } = formattedData;

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<i key={i} className="text-yellow-400">★</i>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<i key={i} className="text-yellow-400">★</i>);
            } else {
                stars.push(<i key={i} className="text-yellow-400">☆</i>);
            }
        }

        return stars;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 w-full overflow-hidden bg-gray-200">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200?text=No+Image+Available";
                    }}
                />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category}
                    </span>
                </div>
                <div className="flex items-center mt-1">
                    <div className="flex mr-2">
                        {renderStars()}
                    </div>
                    <span className="text-gray-500 text-sm">{rating}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>
                <div className="mt-3 text-sm text-gray-500">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{hours}</span>
                    </div>
                    <div className="flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{price}</span>
                    </div>
                </div>
                <Link to={`/restaurants/${restaurant._id}`}
                    className="mt-4 block text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default RestaurantCard;

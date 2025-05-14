import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function RestaurantCard({ restaurant }) {
  const {
    _id,
    RestaurantName,
    image,
    rating: storedRating,
    bio,
    price_range,
    category,
    location,
    Hours,
    orderUrl
  } = restaurant;

  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/restaurants/${_id}/reviews`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load reviews");
        return res.json();
      })
      .then(reviews => {
        if (reviews.length) {
          const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
          setAvgRating(sum / reviews.length);
        }
      })
      .catch(console.error);
  }, [_id]);

  // decide which rating to display
  const displayRating = avgRating !== null ? avgRating : storedRating || 4.5;
  const fullStars   = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 >= 0.5;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="text-yellow-400 text-lg">★</i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="text-yellow-400 text-lg">☆</i>); // replace with your half-star icon if you have one
      } else {
        stars.push(<i key={i} className="text-gray-300 text-lg">☆</i>);
      }
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  const urlToOrder = orderUrl || `https://order.example.com/restaurants/${_id}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 w-full bg-gray-200 overflow-hidden">
        <img
          src={image}
          alt={RestaurantName}
          className="w-full h-full object-cover"
          onError={e => e.target.src = "https://via.placeholder.com/400x200?text=No+Image"}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{RestaurantName}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {category}
          </span>
        </div>

        <div className="flex items-center mb-3">
          {renderStars()}
          <span className="ml-2 text-gray-500 text-sm">
            {displayRating.toFixed(1)}
          </span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{bio}</p>

        <div className="text-sm text-gray-500 space-y-1 mb-4">
          <div className="flex items-center">
            {/* location icon */}
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 
                   01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center">
            {/* hours icon */}
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 
                   11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{Hours}</span>
          </div>
          <div className="flex items-center">
            {/* price icon */}
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2
                   3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599
                   1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1
                   M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{price_range}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/restaurants/${_id}`}
            className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            View Details
          </Link>
          <button
            onClick={() => window.open(urlToOrder, "_blank")}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}

// src/components/RestaurantDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewsSection from './ReviewsSection';

export default function RestaurantDetailPage({ user }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    // Fetch restaurant details
    fetch(`http://localhost:3000/restaurants/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load restaurant');
        return res.json();
      })
      .then(data => {
        setRestaurant(data);
        // Then fetch its reviews to compute the average
        return fetch(`http://localhost:3000/restaurants/${id}/reviews`);
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load reviews');
        return res.json();
      })
      .then(reviews => {
        if (reviews.length > 0) {
          const sum = reviews.reduce((total, r) => total + r.rating, 0);
          setAvgRating(sum / reviews.length);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!restaurant) return <p className="p-6">Restaurant not found.</p>;

  const {
    RestaurantName,
    image,
    category,
    bio,
    location,
    Hours,
    price_range,
    orderUrl
  } = restaurant;

  // Show computed average if available, otherwise default to 4.5
  const displayRating = avgRating !== null
    ? avgRating.toFixed(1)
    : 4.5;

  // Determine order URL (fallback if missing)
  const urlToOrder = orderUrl || `https://order.example.com/restaurants/${id}`;

  return (
    <div className="bg-white container mx-auto px-4 py-8">
      <Link to="/categories" className="text-blue-600 hover:underline">
        &larr; Back to list
      </Link>

      <h1 className="text-4xl font-bold mt-2">{RestaurantName}</h1>
      <p className="text-gray-500">
        {category} &bull; {displayRating} ★
      </p>

      <img
        src={image}
        alt={RestaurantName}
        className="w-full max-h-96 object-cover rounded-lg my-6"
      />

      <p className="mb-4">{bio}</p>

      <ul className="space-y-1 mb-6 text-sm text-gray-700">
        <li><strong>Location:</strong> {location}</li>
        <li><strong>Hours:</strong> {Hours}</li>
        <li><strong>Price range:</strong> {price_range}</li>
      </ul>

      <div className="my-6">
        <button
          onClick={() => window.open(urlToOrder, '_blank')}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition"
        >
          Order Now
        </button>
      </div>

      <ReviewsSection restaurantId={id} user={user} />
    </div>
  );
}

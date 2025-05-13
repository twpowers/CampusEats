import React, { useEffect, useState } from 'react';
import ReviewsSection from './ReviewsSection';

export default function ReviewsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/restaurants')
      .then(res => res.json())
      .then(setRestaurants)
      .catch(console.error);
  }, []);

  return (
    <div className="container my-4">
      <h1 className="text-2xl font-bold mb-4">Browse Reviews</h1>

      <div className="mb-4">
        <label htmlFor="restaurantSelect" className="block mb-1 font-medium">
          Select Restaurant
        </label>
        <select
          id="restaurantSelect"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="form-select border rounded px-3 py-2 w-full"
        >
          <option value="" disabled>Choose a restaurant…</option>
          {restaurants.map(r => (
            <option key={r._id} value={r._id}>{r.RestaurantName}</option>
          ))}
        </select>
      </div>

      {selectedId ? (
        <ReviewsSection restaurantId={selectedId} />
      ) : (
        <p className="text-gray-500">Select a restaurant above to see its reviews.</p>
      )}
    </div>
  );
}
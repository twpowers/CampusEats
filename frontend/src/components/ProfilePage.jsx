import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function ProfilePage({ user }) {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/restaurants`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to load restaurants");
        return r.json();
      })
      .then(async restaurants => {
        const arr = await Promise.all(
          restaurants.map(r =>
            fetch(`${API_BASE}/restaurants/${r._id}/reviews`)
              .then(r2 => {
                if (!r2.ok) throw new Error("Failed to load reviews");
                return r2.json();
              })
              .then(all =>
                all
                  .filter(rv => String(rv.user._id) === user._id)
                  .map(rv => ({
                    ...rv,
                    restaurantId:       r._id,
                    restaurantName:     r.RestaurantName || r.name,
                    restaurantImage:    r.image,
                    restaurantCategory: r.category,
                    restaurantLocation: r.location,
                  }))
              )
          )
        );
        const my = arr
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(my);
      })
      .catch(e => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const renderStars = rating => {
    const stars = [];
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= full || (i === full + 1 && half)) {
        stars.push(<i key={i} className="text-yellow-400">★</i>);
      } else {
        stars.push(<i key={i} className="text-gray-300">☆</i>);
      }
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  const fmtDate = s =>
    new Date(s).toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });

  if (!user) return (
    <div className="flex items-center justify-center h-full py-20">
      <p className="text-gray-600 text-lg">Please log in to view your profile.</p>
    </div>
  );

  return (
    <section className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Hi {user.name}</h1>
        <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </span>
      </div>
        <h3 className="text-2xl font-bold">Your Reviews</h3>
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-600 rounded-full" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-600">You haven't written any reviews yet.</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium mr-3">
                    {r.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{r.user.name}</h3>
                    <time className="text-sm text-gray-500">{fmtDate(r.createdAt)}</time>
                  </div>
                </div>
                {renderStars(r.rating)}
              </div>
              <p className="text-gray-700 mb-4">{r.comment}</p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/restaurants/${r.restaurantId}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View {r.restaurantName}
                </Link>
                <span className="text-sm text-gray-500">{r.restaurantCategory}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
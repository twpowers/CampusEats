import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function ProfilePage({ user }) {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [averageRating, setAverageRating] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({ rating: 5, comment: "" });

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
        setFilteredReviews(my);
        
        if (my.length > 0) {
          const totalRating = my.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / my.length);
        }
      })
      .catch(e => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!reviews.length) return;
    
    let filtered = [...reviews];
    
    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => 
        rating === 5 ? review.rating === 5 : 
        Math.floor(review.rating) === rating
      );
    }
    
    if (dateFilter !== "all") {
      const now = new Date();
      let cutoff = new Date();
      
      if (dateFilter === "week") {
        cutoff.setDate(now.getDate() - 7);
      } else if (dateFilter === "month") {
        cutoff.setMonth(now.getMonth() - 1);
      } else if (dateFilter === "year") {
        cutoff.setFullYear(now.getFullYear() - 1);
      }
      
      filtered = filtered.filter(review => new Date(review.createdAt) >= cutoff);
    }
    
    setFilteredReviews(filtered);
  }, [ratingFilter, dateFilter, reviews]);

  const handleDelete = async id => {
    if (!window.confirm("Delete this review?")) return;
    await fetch(`${API_BASE}/restaurants/${reviews.find(r=>r._id===id).restaurantId}/reviews/${id}`, { method: "DELETE" });
    setReviews(reviews.filter(r => r._id !== id));
  };

  const beginEdit = r => {
    setEditingId(r._id);
    setFormState({ rating: r.rating, comment: r.comment || "" });
  };
  
  const cancelEdit = () => setEditingId(null);
  
  const submitEdit = async id => {
    await fetch(
      `${API_BASE}/restaurants/${reviews.find(r=>r._id===id).restaurantId}/reviews/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      }
    );
    setReviews(reviews.map(r => r._id===id ? { ...r, ...formState, updatedAt: new Date().toISOString() } : r));
    setEditingId(null);
  };

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
        <div className="flex flex-col items-end">
          <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </span>
          {reviews.length > 0 && (
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-600 mr-1">Average Rating:</span>
              <div className="flex items-center">
                {renderStars(averageRating)}
                <span className="ml-1 text-sm text-gray-700">({averageRating.toFixed(1)})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="container mx-auto mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </span>
                <select
                  id="rating-filter"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="rounded-none rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full p-2.5"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
            <div>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm1-13h-2v6l5.2 3.2.8-1.3-4-2.5V7z" />
                  </svg>
                </span>
                <select
                  id="date-filter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="rounded-none rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full p-2.5"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
          </div>
          
          {(ratingFilter !== "all" || dateFilter !== "all") && (
            <div className="mb-4 mt-3">
              <div className="flex justify-end items-center">
                <button
                  onClick={() => {
                    setRatingFilter("all");
                    setDateFilter("all");
                  }}
                  className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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

      {!loading && !error && filteredReviews.length === 0 && reviews.length > 0 && (
        <div className="col-span-3 py-8 text-center">
          <p className="text-gray-500 text-lg">No reviews match your current filters.</p>
          <button
            onClick={() => {
              setRatingFilter("all");
              setDateFilter("all");
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="col-span-3 py-8 text-center">
          <p className="text-gray-500 text-lg">You haven't written any reviews yet.</p>
        </div>
      )}

      {!loading && filteredReviews.length > 0 && (
        <div className="space-y-4">
          {filteredReviews.map(r => (
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
                {editingId===r._id
                  ? (
                    <div className="flex items-center space-x-2">
                      <button onClick={cancelEdit} className="text-gray-600">Cancel</button>
                      <button onClick={()=>submitEdit(r._id)} className="text-blue-600">Save</button>
                    </div>
                  )
                  : (
                    <div className="flex items-center space-x-2">
                      {renderStars(r.rating)}
                      <button onClick={()=>beginEdit(r)} className="text-blue-600 ml-2">Edit</button>
                      <button onClick={()=>handleDelete(r._id)} className="text-red-600">Delete</button>
                    </div>
                  )
                }
              </div>
              {editingId===r._id ? (
                <div className="space-y-2 mb-4">
                  <div>
                    <label className="block text-sm">Rating</label>
                    <input
                      type="number"
                      min="1" max="5" step="1"
                      value={formState.rating}
                      onChange={e=>setFormState(fs=>({...fs, rating:+e.target.value}))}
                      className="w-16 p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Comment</label>
                    <textarea
                      rows="3"
                      value={formState.comment}
                      onChange={e=>setFormState(fs=>({...fs, comment:e.target.value}))}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 mb-4">{r.comment}</p>
              )}
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
import React, { useEffect, useState } from 'react';

export default function ReviewsSection({ restaurantId, user }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/restaurants/${restaurantId}/reviews`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load reviews');
        return res.json();
      })
      .then(data => setReviews(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to post a review.');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/restaurants/${restaurantId}/reviews`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, rating, comment }),
        }
      );
      if (!res.ok) throw new Error('Failed to post review');
      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);
      setComment('');
      setRating(5);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

      {loading && <p>Loading reviews…</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && reviews.length === 0 && (
        <p className="text-gray-500 mb-4">No reviews yet.</p>
      )}

      <ul className="space-y-4 mb-6">
        {reviews.map(r => (
          <li key={r._id} className="p-4 border rounded">
            <div className="flex justify-between items-center mb-1">
              <strong>{r.user.name}</strong>
              <span>{'★'.repeat(r.rating)}</span>
            </div>
            <p className="mb-2">{r.comment}</p>
            <time className="text-xs text-gray-400">
              {new Date(r.createdAt).toLocaleDateString()}
            </time>
          </li>
        ))}
      </ul>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1">Rating</label>
            <select
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{n} ★</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Your Review</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              className="w-full border rounded p-2"
              placeholder="Tell us what you think…"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Review
          </button>
        </form>
      )}
    </section>
  );
}
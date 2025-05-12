import { useEffect, useState } from 'react';

export default function ReviewsSection({ restaurantId, user }) {
  const [reviews, setReviews] = useState([]);
  const [rating,  setRating]  = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/restaurants/${restaurantId}/reviews`)
      .then(r => r.json())
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return alert('Login first');

    const res = await fetch(
      `http://localhost:3000/restaurants/${restaurantId}/reviews`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, rating, comment }),
      }
    );

    if (res.ok) {
      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);   // optimistic update
      setRating(5); setComment('');
    } else {
      alert('Could not post review');
    }
  };

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold">Reviews</h2>

      {loading ? (
        <p>Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map(r => (
            <li key={r._id} className="border p-4 rounded-md">
              <div className="flex items-center gap-2">
                <span className="font-medium">{r.user.name}</span>
                <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-sm mt-1">{r.comment}</p>
              <p className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-2">
          <label className="block">
            <span className="mr-2">Rating:</span>
            <select
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your thoughts…"
            className="w-full border rounded p-2"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      )}
    </section>
  );
}

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

export default function CreateReviewPage({ user }) {
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantId, setRestaurantId] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3000/restaurants')
            .then(res => res.json())
            .then(setRestaurants)
            .catch(console.error);
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!restaurantId || !user) return;

        const res = await fetch(
            `http://localhost:3000/restaurants/${restaurantId}/reviews`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, rating, comment }),
            }
        );

        if (res.ok) {
            setSuccess(true);
            setComment('');
            setRating(5);
        } else {
            alert('Error submitting review');
        }
    };

    return (
        <div className="container my-5 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Write a Review</h1>

            {!user && (
                <p className="text-red-500">
                    You must <Link to="/login" className="underline">log in</Link> to write a review.
                </p>
            )}

            {success && (
                <div className="alert alert-success mb-4">
                    Review submitted! <Link to={`/restaurants/${restaurantId}`}>View it here</Link>.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="restaurantId" className="block font-medium mb-1">Restaurant</label>
                    <select
                        id="restaurantId"
                        value={restaurantId}
                        onChange={e => setRestaurantId(e.target.value)}
                        className="form-select w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="" disabled>Choose a restaurant…</option>
                        {restaurants.map(r => (
                            <option key={r._id} value={r._id}>{r.RestaurantName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">Rating</label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(n => (
                            <button
                                key={n}
                                type="button"
                                className={n <= rating ? 'text-yellow-400' : 'text-gray-300'}
                                onClick={() => setRating(n)}
                            >★</button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="comment" className="block font-medium mb-1">Your Review</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={4}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={!user}
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
}

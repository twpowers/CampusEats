import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReviewsSection from './ReviewsSection';

export default function RestaurantDetailPage({ user }) {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3000/restaurants/${id}`)
            .then(r => r.json())
            .then(setRestaurant)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="p-6">Loading…</p>;
    if (!restaurant) return <p className="p-6">Restaurant not found.</p>;

    const { RestaurantName, image, category, rating, bio, location, Hours, price_Range } = restaurant;

    return (
        <div className="bg-white container mx-auto px-4 py-8">
            <Link to="/categories" className="text-blue-600 hover:underline">&larr; Back to list</Link>

            <h1 className="text-4xl font-bold mt-2">{RestaurantName}</h1>
            <p className="text-gray-500">{category} &bull; {rating} ★</p>

            <img src={image} alt={RestaurantName} className="w-full max-h-96 object-cover rounded-lg my-6" />

            <p className="mb-4">{bio}</p>

            <ul className="space-y-1 mb-8 text-sm text-gray-700">
                <li><strong>Location:</strong> {location}</li>
                <li><strong>Hours:</strong> {Hours}</li>
                <li><strong>Price range:</strong> {price_Range}</li>
            </ul>

            <ReviewsSection restaurantId={id} user={user} />
        </div>
    );
}

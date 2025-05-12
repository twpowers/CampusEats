import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRestaurantPage = ({ onRestaurantAdded }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        RestaurantName: "",
        category: "Pizza",
        rating: 0,
        image: "",
        bio: "",
        location: "",
        Hours: "",
        price_range: "$",
        dateAdded: new Date().toISOString().split('T')[0],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const categoryOptions = [
        { value: "Pizza", label: "Pizza" },
        { value: "Burgers", label: "Burgers" },
        { value: "Mexican", label: "Mexican" },
        { value: "Asian", label: "Asian" },
        { value: "Italian", label: "Italian" },
        { value: "Vegetarian", label: "Vegetarian" }
    ];

    const priceRangeOptions = [
        { value: "$", label: "$ (Under $10)" },
        { value: "$$ ($10-$20)", label: "$$ ($10-$20)" },
        { value: "$$$ ($20-$30)", label: "$$$ ($20-$30)" },
        { value: "$$$$ (Over $30)", label: "$$$$ (Over $30)" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRatingChange = (newRating) => {
        setFormData({
            ...formData,
            rating: newRating
        });
    };

    const validateForm = () => {
        const requiredFields = ['RestaurantName', 'category', 'bio', 'location', 'Hours'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setErrorMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        setErrorMessage("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const newRestaurant = {
                ...formData,
                rating: parseFloat(formData.rating),
                image: formData.image,
                id: Date.now().toString()
            };

            fetch("http://localhost:3000/restaurants/addRestaurant", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRestaurant)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    console.log(JSON.stringify(newRestaurant))
                }).catch(e => {
                    console.error("There was an error adding a new restaurnt", e);
                })

            if (onRestaurantAdded) {
                onRestaurantAdded(newRestaurant);
            }

            setTimeout(() => {
                navigate('/categories');
            }, 100);

        } catch (error) {
            console.error("Error adding restaurant:", error);
            setErrorMessage("Failed to add restaurant. Please try again.");
            setIsSubmitting(false);
        }
    };

    const StarRating = ({ rating, onRatingChange }) => {
        const [hoverRating, setHoverRating] = useState(0);

        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div
                        key={star}
                        className="cursor-pointer text-2xl px-1"
                        onClick={() => onRatingChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                    >
                        {star <= (hoverRating || rating) ? (
                            <span className="text-yellow-400">★</span>
                        ) : (
                            <span className="text-gray-300">☆</span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Add New Restaurant</h1>

            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="RestaurantName">
                        Restaurant Name*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="RestaurantName"
                        type="text"
                        name="RestaurantName"
                        value={formData.RestaurantName}
                        onChange={handleInputChange}
                        placeholder="Restaurant Name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                        Category*
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                    >
                        {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Rating*
                    </label>
                    <StarRating rating={formData.rating} onRatingChange={handleRatingChange} />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Image URL
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="image"
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="Image URL (leave empty for default)"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                        Description*
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Restaurant description"
                        rows="3"
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                        Location*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Address"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Hours">
                        Hours*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="Hours"
                        type="text"
                        name="Hours"
                        value={formData.Hours}
                        onChange={handleInputChange}
                        placeholder="e.g. 11:00 AM – 10:00 PM"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_range">
                        Price Range
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="price_range"
                        name="price_range"
                        value={formData.price_range}
                        onChange={handleInputChange}
                    >
                        {priceRangeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add Restaurant"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRestaurantPage;

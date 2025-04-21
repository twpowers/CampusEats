import React from "react";

const RestaurantCard = ({ restaurant }) => {
    const {
        name = "Panda Express",
        image = "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?q=80&w=800&auto=format&fit=crop",
        rating = 3.8,
        description = "Fast-casual restaurant serving American Chinese cuisine with fresh ingredients and bold flavors.",
        price = "$$",
        category = "Asian",
    } = restaurant || {};

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<i key={i} className="text-yellow-400">★</i>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<i key={i} className="text-yellow-400">★</i>);
            } else {
                stars.push(<i key={i} className="text-yellow-400">☆</i>);
            }
        }

        return stars;
    };

    return (
        <div className="max-w-sm mx-auto relative rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <img
                src={image}
                alt={name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h5 className="text-lg font-semibold mb-1">{name}</h5>
                <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                        {renderStars()}
                    </div>
                    <span className="text-gray-500 text-sm">{rating}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">{price} • {category}</span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;

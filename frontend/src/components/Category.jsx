import React from "react";
import RestaurantCard from "./RestaurantCard";

const Category = ({ title, data }) => {
    return (
        <div className="mb-12">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
                {data && data.map((restaurant, index) => (
                    <RestaurantCard
                        key={index}
                        restaurant={restaurant}
                    />
                ))}
            </div>
        </div>
    );
};

export default Category;

import React from "react";
import RestaurantCard from "./RestaurantCard";

const NewestAdded = () => {
    return (
        <div className="container mx-auto px-4 mt-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold">Newest Added</h1>
                <button className="border-blue-500 border py-2 px-3 rounded text-blue-500 hover:bg-blue-50">View All</button>
            </div>

            <div className="grid grid-cols-4 gap-6 mt-6">
                <RestaurantCard />
            </div>
        </div>
    )
}

export default NewestAdded;

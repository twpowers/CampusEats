import React from "react";
import NewestAdded from "./NewestAdded";

const HomePage = () => {
    return (
        <div className="w-full">
            <div className="bg-gray-100 w-full py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl text-center font-bold mb-2">Top Restaurants</h1>
                    <p className="text-center text-gray-600">Discover the best dining options around campus</p>
                </div>
            </div>
            <div>
                <NewestAdded />
            </div>
        </div>
    )
}

export default HomePage;

import React, { useState, useEffect } from "react";
import Category from "./Category";
import restaurantData from "../assets/data-with-dates.json";

const HomePage = () => {
    const [newestRestaurants, setNewestRestaurants] = useState([]);
    const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
    const [localFavorites, setLocalFavorites] = useState([]);

    useEffect(() => {
        const allRestaurants = restaurantData.Restaurant;

        const getNewestRestaurants = () => {
            return [...allRestaurants]
                .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                .slice(0, 3);
        };

        const getTopRatedRestaurants = () => {
            return [...allRestaurants]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3);
        };

        const getLocalFavorites = () => {
            const favoriteNames = ["Hickory Park", "Jeff's Pizza Shop", "El Azteca"];
            return allRestaurants.filter(restaurant =>
                favoriteNames.includes(restaurant.RestaurantName)
            );
        };

        setNewestRestaurants(getNewestRestaurants());
        setTopRatedRestaurants(getTopRatedRestaurants());
        setLocalFavorites(getLocalFavorites());
    }, []);

    return (
        <div className="w-full">
            <div className="bg-gray-100 w-full py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl text-center font-bold mb-2">Top Restaurants</h1>
                    <p className="text-center text-gray-600">Discover the best dining options around campus</p>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-8">
                <Category title="Newest Added" data={newestRestaurants} />
                <Category title="Top Rated" data={topRatedRestaurants} />
                <Category title="Local Favorites" data={localFavorites} />
            </div>
        </div>
    );
};

export default HomePage;

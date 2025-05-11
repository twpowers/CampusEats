import React, { useState, useEffect } from "react";
import Category from "./Category";
import restaurantData from "../assets/data-with-dates.json";

const HomePage = ({ user }) => {
    const [newestRestaurants, setNewestRestaurants] = useState([]);
    const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
    const [localFavorites, setLocalFavorites] = useState([]);

    const fetchAllRestaurants = async () => {
        try {
            const response = await fetch("http://localhost:3000/restaurants");

            if (!response.ok) {
                throw Error(`Http error Status: ${response.status}`)
            }

            const restaurants = await response.json();

            console.log("restaurants", restaurants);
            return restaurants;
        } catch (e) {
            console.error("Error fetching restaurants:", e);
            return [];
        }
    }

    useEffect(() => {

        const loadRestaurants = async () => {
            try {
                const data = await fetchAllRestaurants();

                if (data) {

                    const getNewestRestaurants = () => {
                        return [...data]
                            .sort((a, b) => new Date(b.dateAdded | b.createdAt) - new Date(a.dateAdded | a.createdAt))
                            .slice(0, 3);
                    };

                    const getTopRatedRestaurants = () => {
                        return [...data]
                            .sort((a, b) => b.rating - a.rating)
                            .slice(0, 3);
                    };

                    const getLocalFavorites = () => {
                        const favoriteNames = ["Hickory Park", "Jeff's Pizza Shop", "El Azteca"];
                        return data.filter(restaurant =>
                            favoriteNames.includes(restaurant.RestaurantName)
                        );
                    };
                    setNewestRestaurants(getNewestRestaurants());
                    setTopRatedRestaurants(getTopRatedRestaurants());
                    setLocalFavorites(getLocalFavorites());
                }

            } catch (e) {
                console.error("Error getting data");
            }
        }
        loadRestaurants()
    }, []);

    return (
        <div className="w-full bg-white">
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

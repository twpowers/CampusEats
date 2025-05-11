import React, { useState, useEffect, useRef } from "react";
// import restaurantData from "../assets/data-with-dates.json";
import RestaurantCard from "./RestaurantCard";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";

const CategoriesPage = ({ newRestaurant }) => {
    const [searchInput, setSearchInput] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [displayedRestaurants, setDisplayedRestaurants] = useState([]);
    const [filteredCategory, setFilteredCategory] = useState("all");
    const [allRestaurants, setAllRestaurants] = useState([]);

    const lastAddedRef = useRef(null);

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
            const data = await fetchAllRestaurants();
            setAllRestaurants(data);
        };
        loadRestaurants();
    }, []);

    useEffect(() => {
        if (newRestaurant) {
            const isAlreadyAdded = lastAddedRef.current === newRestaurant;

            if (!isAlreadyAdded) {
                lastAddedRef.current = newRestaurant;

                setAllRestaurants(prev => {
                    if (newRestaurant.id) {
                        const exists = prev.some(r => r.id === newRestaurant.id);
                        if (!exists) {
                            return [...prev, newRestaurant];
                        }
                        return prev;
                    }

                    return [...prev, newRestaurant];
                });
            }
        }
    }, [newRestaurant]);

    const categoryTypes = [
        { id: 1, name: "All", type: "all" },
        { id: 2, name: "Pizza", type: "pizza" },
        { id: 3, name: "Burgers", type: "burgers" },
        { id: 4, name: "Mexican", type: "mexican" },
        { id: 5, name: "Asian", type: "asian" }
    ];

    useEffect(() => {
        let filtered = allRestaurants;

        if (filteredCategory !== "all") {
            filtered = filtered.filter(
                (restaurant) => restaurant.category && restaurant.category.toLowerCase() === filteredCategory
            );
        }

        if (searchInput.trim() !== "") {
            const searchTerm = searchInput.toLowerCase();
            filtered = filtered.filter((restaurant) =>
                restaurant.RestaurantName && restaurant.RestaurantName.toLowerCase().includes(searchTerm)
            );
        }

        if (sortOption) {
            const [property, direction] = sortOption.split("-");
            filtered = [...filtered].sort((a, b) => {
                let valueA, valueB;

                if (property === "name") {
                    valueA = a.RestaurantName ? a.RestaurantName.toLowerCase() : '';
                    valueB = b.RestaurantName ? b.RestaurantName.toLowerCase() : '';
                } else if (property === "price") {
                    try {
                        valueA = a.price_Range ? parseInt(a.price_Range.match(/\$(\d+)/)?.[1] || 0) : 0;
                        valueB = b.price_Range ? parseInt(b.price_Range.match(/\$(\d+)/)?.[1] || 0) : 0;
                    } catch (e) {
                        console.error("Error parsing price:", e);
                        valueA = 0;
                        valueB = 0;
                    }
                }

                if (direction === "ascending") {
                    return valueA > valueB ? 1 : -1;
                } else {
                    return valueA < valueB ? 1 : -1;
                }
            });
        }

        setDisplayedRestaurants(filtered);
    }, [filteredCategory, searchInput, sortOption, allRestaurants]);

    const handleCategoryClick = (type) => {
        setFilteredCategory(type);
    };

    const handleSearch = () => {
    };

    return (
        <div className="bg-white">
            <div className="bg-gray-100 w-full py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl text-center font-bold mb-2" id="page-title">
                        {filteredCategory === "all" ? "All Restaurants" : `${filteredCategory.charAt(0).toUpperCase() + filteredCategory.slice(1)} Restaurants`}
                    </h1>
                    <p className="text-center text-gray-600 mb-4" id="page-description">
                        Discover all dining options available near campus
                    </p>

                    <div className="flex justify-center mb-6">
                        <Link
                            to="/add-restaurant"
                            className="relative rounded-md bg-green-600 p-1 text-white hover:bg-green-700 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-100 flex items-center px-4 py-2"
                        >
                            <PlusIcon aria-hidden="true" className="size-5 mr-2" />
                            <span>Add New Restaurant</span>
                        </Link>
                    </div>

                    <div className="flex justify-center mt-4">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                            {categoryTypes.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.type)}
                                    className={`px-4 py-2 text-sm font-medium border border-gray-300
                                    hover:bg-gray-100 hover:text-blue-600 focus:z-10 focus:ring-2
                                    focus:ring-blue-600 first:rounded-l-lg last:rounded-r-lg
                                    ${filteredCategory === category.type ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' : 'bg-white'}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-4">
                <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-3 mb-3">
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                className="rounded-none rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full p-2.5"
                                placeholder="Search by restaurant name..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button
                                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 ml-2"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="flex">
                            <label className="inline-flex items-center px-3 text-gray-500 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 4a1 1 0 0 0-2 0v8.586L1.707 11.293a1 1 0 1 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L5 12.586V4z" />
                                    <path d="M15 16a1 1 0 0 0 2 0V7.414l1.293 1.293a1 1 0 0 0 1.414-1.414l-3-3a1 1 0 0 0-1.414 0l-3 3a1 1 0 0 0 1.414 1.414L15 7.414V16z" />
                                </svg>
                                Sort
                            </label>
                            <select
                                className="rounded-none rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full p-2.5"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="">Default Order</option>
                                <option value="name-ascending">Name (A to Z)</option>
                                <option value="name-descending">Name (Z to A)</option>
                                <option value="price-ascending">Price (Low to High)</option>
                                <option value="price-descending">Price (High to Low)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <div id="filter-tags" className="flex flex-wrap gap-2"></div>
                        {(searchInput || filteredCategory !== "all" || sortOption) && (
                            <button
                                onClick={() => {
                                    setSearchInput("");
                                    setFilteredCategory("all");
                                    setSortOption("");
                                }}
                                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 my-3">
                <div className="grid grid-cols-3 gap-4">
                    {displayedRestaurants.length > 0 ? (
                        displayedRestaurants.map((restaurant, index) => (
                            <RestaurantCard key={index} restaurant={restaurant} />
                        ))
                    ) : (
                        <div className="col-span-3 py-8 text-center">
                            <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
                            <button
                                onClick={() => {
                                    setSearchInput("");
                                    setFilteredCategory("all");
                                    setSortOption("");
                                }}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <footer className="bg-gray-800 text-white py-4 mt-8">
                <div className="container mx-auto px-4">
                    <p className="mb-0">&copy; 2025 Campus Eats</p>
                </div>
            </footer>
        </div>
    );
};

export default CategoriesPage;

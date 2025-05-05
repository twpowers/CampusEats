import React, { useState, useRef } from "react";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import CategoriesPage from "./components/CategoriesPage";
import AddRestaurantPage from "./components/AddRestaurantPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
    const [lastAddedRestaurant, setLastAddedRestaurant] = useState(null);
    const lastRestaurantRef = useRef(null);

    const handleRestaurantAdded = (newRestaurant) => {
        lastRestaurantRef.current = newRestaurant;
        setLastAddedRestaurant(newRestaurant);
    };

    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoriesPage newRestaurant={lastAddedRestaurant} />} />
                <Route path="/add-restaurant" element={<AddRestaurantPage onRestaurantAdded={handleRestaurantAdded} />} />
            </Routes>
        </Router>
    );
}

export default App;

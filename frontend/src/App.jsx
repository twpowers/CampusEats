import React, { useState, useRef } from "react";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import CategoriesPage from "./components/CategoriesPage";
import AddRestaurantPage from "./components/AddRestaurantPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from "./components/LoginPage";

function App() {
    const [lastAddedRestaurant, setLastAddedRestaurant] = useState(null);
    const [user, setUser] = useState(null)
    const lastRestaurantRef = useRef(null);

    const handleRestaurantAdded = (newRestaurant) => {
        lastRestaurantRef.current = newRestaurant;
        setLastAddedRestaurant(newRestaurant);
    };

    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/login" element={<LoginPage user={user} />} />
                <Route path="/" element={<HomePage user={user} />} />
                <Route path="/categories" element={<CategoriesPage newRestaurant={lastAddedRestaurant} user={user} />} />
                <Route path="/add-restaurant" element={<AddRestaurantPage onRestaurantAdded={handleRestaurantAdded} user={user} />} />
            </Routes>
        </Router>
    );
}

export default App;

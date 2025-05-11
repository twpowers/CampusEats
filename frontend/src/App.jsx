import React, { useState, useRef } from "react";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import CategoriesPage from "./components/CategoriesPage";
import AddRestaurantPage from "./components/AddRestaurantPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    const [lastAddedRestaurant, setLastAddedRestaurant] = useState(null);
    const [user, setUser] = useState(null);
    const lastRestaurantRef = useRef(null);

    const handleRestaurantAdded = (newRestaurant) => {
        lastRestaurantRef.current = newRestaurant;
        setLastAddedRestaurant(newRestaurant);
    };

    return (
        <Router>
            <NavBar user={user} setUser={setUser} />
            <Routes>
                <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
                <Route path="/" element={
                    <ProtectedRoute user={user}>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/categories" element={
                    <ProtectedRoute user={user}>
                        <CategoriesPage newRestaurant={lastAddedRestaurant} />
                    </ProtectedRoute>
                } />
                <Route path="/add-restaurant" element={
                    <ProtectedRoute user={user}>
                        <AddRestaurantPage onRestaurantAdded={handleRestaurantAdded} />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;

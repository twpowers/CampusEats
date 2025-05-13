import React, { useState, useRef, useEffect } from "react";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import CategoriesPage from "./components/CategoriesPage";
import AddRestaurantPage from "./components/AddRestaurantPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutPage from "./components/AboutPage";

function App() {
    const [lastAddedRestaurant, setLastAddedRestaurant] = useState(null);
    const [user, setUser] = useState(null);
    const lastRestaurantRef = useRef(null);

    useEffect(() => {
        const user = localStorage.getItem('user')

        if (user) {
            setUser(JSON.parse(user))
        }

    }, [])

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
                    <ProtectedRoute >
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/categories" element={
                    <ProtectedRoute >
                        <CategoriesPage newRestaurant={lastAddedRestaurant} />
                    </ProtectedRoute>
                } />
                <Route path="/add-restaurant" element={
                    <ProtectedRoute>
                        <AddRestaurantPage onRestaurantAdded={handleRestaurantAdded} />
                    </ProtectedRoute>
                } />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </Router>
    );
}

export default App;

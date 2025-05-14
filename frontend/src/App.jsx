import React, { useState, useRef, useEffect } from "react";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import CategoriesPage from "./components/CategoriesPage";
import AddRestaurantPage from "./components/AddRestaurantPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RestaurantDetailPage from "./components/RestaurantDetailPage";
import ReviewsPage from './components/ReviewsPage';
import CreateReviewPage from './components/CreateReviewPage';
import AboutPage from "./components/AboutPage";
import SignupPage from './components/SignupPage';

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
        <div className="bg-white min-h-screen flex flex-col">
            <Router>
                <NavBar user={user} setUser={setUser} />
                <main className="flex-grow">
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
                        <Route path="/restaurants/:id" element={
                            <ProtectedRoute user={user}>
                                <RestaurantDetailPage user={user} />
                            </ProtectedRoute>
                        }
                        />
                        <Route
                            path="/reviews"
                            element={<ReviewsPage user={user} />}
                        />
                        <Route
                            path="/create-review"
                            element={<ProtectedRoute user={user}><CreateReviewPage /></ProtectedRoute>}
                        />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/signup" element={<SignupPage setUser={setUser} />} />

                    </Routes>
                </main>
                <footer className="bg-gray-800 text-white py-4 mt-8">
                    <div className="container mx-auto px-4">
                        <p className="mb-0">&copy; 2025 Campus Eats</p>
                    </div>
                </footer>
            </Router>
        </div>
    );
}

export default App;

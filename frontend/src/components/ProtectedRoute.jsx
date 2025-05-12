import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(null)
    const location = useLocation();

    useEffect(() => {
        try {
            const user = localStorage.getItem('user')

            if (user) {
                setLoggedIn(JSON.parse(user))
            } else {
                setLoggedIn(false)
            }
        } catch (error) {
            console.error("Error checking authentication:", error)
            setLoggedIn(false)
        } finally {
            setLoading(false)
        }
    }, [location.pathname])

    if (loading) {
        return <div>Loading...</div>
    }

    return loggedIn ? children : <Navigate to="/login" replace />
};

export default ProtectedRoute;

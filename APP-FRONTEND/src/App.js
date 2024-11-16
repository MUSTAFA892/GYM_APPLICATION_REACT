import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import main from './components/main'

const App = () => {
    const isAuthenticated = localStorage.getItem('user');

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/main" /> : <Login />} />

                {/* Redirect to login page if user is not authenticated */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/main" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;

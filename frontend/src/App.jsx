// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';

// Importing Components
import Header from './components/Header';
import Map from './components/Map';
import Login from './components/Login';
import Register from './components/Register';
import AddLocation from './components/AddLocation';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this component is created and imported

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
  });

  // Verify token on mount
  useEffect(() => {
    if (auth.token) {
      // Verify token with backend (ensure backend is running on port 5000)
      axios
        .get('http://localhost:5000/api/verify', {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((response) => {
          setAuth({
            token: auth.token,
            username: response.data.username,
          });
        })
        .catch((error) => {
          console.error('Token verification failed:', error);
          setAuth({ token: null, username: null });
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        });
    }
  }, [auth.token]); // Add auth.token as a dependency to avoid exhaustive-deps warning

  // Handle user login
  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setAuth({ token, username });
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuth({ token: null, username: null });

    // Inform backend about logout
    axios
      .post(
        'http://localhost:5000/api/logout',
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      )
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <Router>
      <Header auth={auth} onLogout={handleLogout} />
      <Routes>
        {/* Home Route - Map */}
        <Route path="/" element={<Map />} />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            !auth.token ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Register Route */}
        <Route
          path="/register"
          element={
            !auth.token ? (
              <Register />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Add Location Route - Protected */}
        <Route
          path="/add-location"
          element={
            <ProtectedRoute auth={auth}>
              <AddLocation token={auth.token} />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
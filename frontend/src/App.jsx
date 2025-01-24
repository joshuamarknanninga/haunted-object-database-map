// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Map from './components/Map';
import Login from './components/Login';
import Register from './components/Register';
import AddLocation from './components/AddLocation';
import axios from 'axios';

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
  });

  // Optionally, verify token on mount
  useEffect(() => {
    if (auth.token) {
      // Optionally, verify token with backend
      axios.get('http://localhost:3001/api/verify', {
        headers: { 'Authorization': `Bearer ${auth.token}` },
      })
      .then(response => {
        setAuth({
          token: auth.token,
          username: response.data.username,
        });
      })
      .catch(error => {
        console.error('Token verification failed:', error);
        setAuth({ token: null, username: null });
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      });
    }
  }, []);

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setAuth({ token, username });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuth({ token: null, username: null });
    // Optionally, inform backend
    axios.post('http://localhost:5000/api/logout', {}, {
      headers: { 'Authorization': `Bearer ${auth.token}` },
    })
    .then(response => {
      console.log(response.data.message);
    })
    .catch(error => {
      console.error('Logout failed:', error);
    });
  };

  return (
    <Router>
      <Header auth={auth} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/login" element={!auth.token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/register" element={!auth.token ? <Register /> : <Navigate to="/" />} />
        <Route path="/add-location" element={auth.token ? <AddLocation token={auth.token} /> : <Navigate to="/login" />} />
        <Route
  path="/add-location"
  element={
    <ProtectedRoute auth={auth}>
      <AddLocation token={auth.token} />
    </ProtectedRoute>
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
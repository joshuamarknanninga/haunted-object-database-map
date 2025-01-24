// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  // Initialize auth state from localStorage
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
  });

  // Optional: Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (auth.token) {
        try {
          // Optional: Create a /api/verify endpoint to verify token
          const response = await axios.get('http://localhost:5000/api/verify', {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          setAuth({
            token: auth.token,
            username: response.data.username,
          });
        } catch (error) {
          console.error('Token verification failed:', error);
          handleLogout();
        }
      }
    };
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Optionally, inform backend about logout
    axios.post('http://localhost:5000/api/logout', {}, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    .then(response => {
      console.log(response.data.message);
    })
    .catch(error => {
      console.error('Logout failed:', error);
    });
  };

  return (
    <AuthContext.Provider value={{ auth, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

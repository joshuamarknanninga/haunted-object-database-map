// frontend/src/components/Header.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaGhost } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { auth, handleLogout } = useContext(AuthContext);

  return (
    <header className="bg-indigo-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center mb-4 md:mb-0">
          <FaGhost className="text-3xl mr-2 animate-pulse" />
          <h1 className="text-2xl font-bold">Haunted Objects and Places Map</h1>
        </div>

        {/* Navigation Links */}
        <nav>
          {auth.token ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {auth.username}</span>
              <Link
                to="/add-location"
                className="px-3 py-2 bg-indigo-700 rounded-md hover:bg-indigo-800 transition-colors"
              >
                Add Location
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-3 py-2 bg-indigo-700 rounded-md hover:bg-indigo-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
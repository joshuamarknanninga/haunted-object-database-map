// frontend/src/components/Header.jsx
import React from 'react';
import { FaGhost } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-center">
        <FaGhost className="text-3xl mr-2 animate-pulse" />
        <h1 className="text-2xl font-bold">Haunted Objects and Places Map</h1>
      </div>
    </header>
  );
};

export default Header;

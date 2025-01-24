// frontend/src/App.jsx
import React from 'react';
import Header from './components/Header';
import Map from './components/Map';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Map />
    </div>
  );
}

export default App;


// frontend/src/components/AddLocation.jsx

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddLocation = () => {
  const { auth } = useContext(AuthContext); // Accessing auth token
  const [form, setForm] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    behavior: '',
    documented: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validate required fields
    if (!form.name || !form.description || !form.latitude || !form.longitude) {
      setError('Please fill in all required fields.');
      return;
    }
    // Validate latitude and longitude as numbers
    const latitude = parseFloat(form.latitude);
    const longitude = parseFloat(form.longitude);
    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Latitude and Longitude must be valid numbers.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          latitude,
          longitude,
          behavior: form.behavior,
          documented: form.documented,
        }),
      });
      alert('Location added successfully.');
      navigate('/'); // Redirect to Home after successful submission
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add location.');
    }
  };

  return (
    <div className="flex items-center justify-center mt-10 mb-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Add Haunted Location</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
            required
            placeholder="Haunted Location Name"
          />
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
            required
            rows="4"
            placeholder="Description of the haunting"
          ></textarea>
        </div>
        
        {/* Latitude and Longitude */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Latitude<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
              required
              placeholder="e.g., 40.7128"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Longitude<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
              required
              placeholder="e.g., -74.0060"
            />
          </div>
        </div>
        
        {/* Behavior */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            What is Haunted About It
          </label>
          <textarea
            name="behavior"
            value={form.behavior}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
            rows="3"
            placeholder="Describe the haunted behavior"
          ></textarea>
        </div>
        
        {/* Documented Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="documented"
            checked={form.documented}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">
            I have documented the haunted object behaving in a strange way.
          </label>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Location
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
// frontend/src/components/Map.jsx

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '80vh',
};

const center = {
  lat: 39.8283, // Center of USA
  lng: -98.5795,
};

const Map = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/locations');
        setLocations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations. Please try again later.');
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Handle marker click to show InfoWindow
  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  // Handle closing InfoWindow
  const handleInfoWindowClose = () => {
    setSelectedLocation(null);
  };

  if (loading) return <div className="text-center mt-10">Loading map...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="relative">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={4}
        >
          {/* Render Markers for each location */}
          {locations.map((location) => (
            <Marker
              key={location._id}
              position={{ lat: location.latitude, lng: location.longitude }}
              title={location.name}
              onClick={() => handleMarkerClick(location)}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}

          {/* InfoWindow for Selected Location */}
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-2">
                <h2 className="text-lg font-semibold">{selectedLocation.name}</h2>
                <p>{selectedLocation.description}</p>
                {selectedLocation.behavior && (
                  <p><strong>Behavior:</strong> {selectedLocation.behavior}</p>
                )}
                <p><strong>Documented:</strong> {selectedLocation.documented ? 'Yes' : 'No'}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <em>Submitted by: {selectedLocation.createdBy.username}</em>
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
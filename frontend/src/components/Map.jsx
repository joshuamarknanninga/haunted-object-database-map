// frontend/src/components/Map.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import LocationForm from './LocationForm';
// import { FaMapMarkerAlt } from 'react-icons/fa';

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
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch locations from backend
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    const newLocation = {
      name: data.name,
      description: data.description,
      latitude: selectedPosition.lat,
      longitude: selectedPosition.lng,
    };
    try {
      const response = await axios.post('http://localhost:5000/api/locations', newLocation);
      setLocations([...locations, response.data]);
      setIsFormOpen(false);
      setSelectedPosition(null);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleInfoWindowClose = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="relative">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={4}
          onClick={handleMapClick}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.latitude, lng: location.longitude }}
              title={location.name}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => handleMarkerClick(location)}
            />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-2">
                <h2 className="text-lg font-semibold">{selectedLocation.name}</h2>
                <p>{selectedLocation.description}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Location Form Modal */}
      {isFormOpen && selectedPosition && (
        <LocationForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default Map;

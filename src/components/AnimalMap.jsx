import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Import Leaflet CSS for map styling
import 'leaflet/dist/leaflet.css';

// Fix missing marker icons in Leaflet by providing default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically fit map bounds to include all markers
const FitBounds = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      // Calculate and set map bounds based on marker coordinates
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] }); // Add padding for better visibility
    }
  }, [coordinates, map]);

  return null;
};

// Main map component to display animal locations
const AnimalMap = ({ data }) => {
  // Filter data to include only animals with valid latitude and longitude
  const animalsWithCoordinates = data.filter(
    (animal) => animal.location_lat && animal.location_long
  );

  // Display a message if no valid locations are available
  if (animalsWithCoordinates.length === 0) {
    return <div>No animal locations available to display on the map.</div>;
  }

  return (
    <MapContainer
      center={[0, 0]} // Default center; updated dynamically by FitBounds
      zoom={2}        // Default zoom; updated dynamically by FitBounds
      style={{ height: '400px', width: '100%' }} // Set map container dimensions
    >
      {/* Add OpenStreetMap tile layer for map visuals */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Place markers for animals with valid coordinates */}
      {animalsWithCoordinates.map((animal, index) => (
        <Marker
          key={index}
          position={[animal.location_lat, animal.location_long]}
        >
          <Popup>
            <strong>{animal.name || 'Unknown Name'}</strong>
            <br />
            {animal.breed || 'Unknown Breed'}
          </Popup>
        </Marker>
      ))}

      {/* Dynamically adjust map bounds to include all markers */}
      <FitBounds
        coordinates={animalsWithCoordinates.map((animal) => [
          animal.location_lat,
          animal.location_long,
        ])}
      />
    </MapContainer>
  );
};

export default AnimalMap;
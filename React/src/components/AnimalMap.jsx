import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for missing marker icons in Leaflet
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FitBounds = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] }); // Add padding for better visibility
    }
  }, [coordinates, map]);

  return null;
};

const AnimalMap = ({ data }) => {
  // Extract animals with valid coordinates
  const animalsWithCoordinates = data.filter(
    (animal) => animal.location_lat && animal.location_long
  );

  if (animalsWithCoordinates.length === 0) {
    return <div>No animal locations available to display on the map.</div>;
  }

  return (
    <MapContainer
      center={[0, 0]} // Default center; updated dynamically by FitBounds
      zoom={2} // Default zoom; updated dynamically by FitBounds
      style={{ height: '400px', width: '100%' }} // Responsive size
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
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
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const GeolocationComponent = ({ onLocationVerified }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Request location permission when the component mounts
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Only update if coordinates change
          if (latitude && longitude) {
            onLocationVerified({ latitude, longitude });
            setLoading(false);
          }
        },
        (err) => {
          setLoading(false);
          setError('Failed to get location');
          toast.error('Location access denied. Please enable location services.');
        }
      );
    } else {
      setLoading(false);
      setError('Geolocation is not supported by this browser.');
      toast.error('Geolocation is not supported by this browser.');
    }
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="mb-4">
      {loading && <p>Getting your location...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default GeolocationComponent;

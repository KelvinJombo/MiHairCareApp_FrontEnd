// src/hooks/useUserLocation.js
import { useEffect, useState } from "react";

export function useUserLocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported");
      setStatus("error");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("success");
      },
      (err) => {
        setError(err.message || "Unable to get location");
        setStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { coords, status, error };
}

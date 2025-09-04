// src/utils/distance.js
export function distanceKm(a, b) {
    if (!a || !b) return null;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
  
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  
  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }
  
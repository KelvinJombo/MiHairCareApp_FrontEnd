// src/components/StylistMap.jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fit map to markers + user
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);
  return null;
}

export default function StylistMap({ userLocation, stylists }) {
  const center = userLocation || { lat: 6.5244, lng: 3.3792 }; // Lagos fallback

  // Collect all points we want to fit to
  const fitPoints = [
    ...(userLocation ? [userLocation] : []),
    ...stylists
      .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng))
      .map((s) => ({ lat: s.lat, lng: s.lng })),
  ];

  return (
    <div style={{ height: 420, width: '100%', borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {stylists.map((s) =>
          Number.isFinite(s.lat) && Number.isFinite(s.lng) ? (
            <Marker key={s.id} position={[s.lat, s.lng]}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong>{s.name || s.businessName || 'Stylist'}</strong>
                  {Number.isFinite(s.distanceKm) && (
                    <div>{s.distanceKm.toFixed(1)} km away</div>
                  )}
                  {s.phoneNumber && <div>📞 {s.phoneNumber}</div>}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}

        {!!fitPoints.length && <FitBounds points={fitPoints} />}
      </MapContainer>
    </div>
  );
}

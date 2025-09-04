// // src/pages/HairstyleStylists.jsx
// import { useEffect, useMemo, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getStylistsByHairStyle } from '../api/client';
// import { useUserLocation } from '../hooks/useUserLocation';
// import { distanceKm } from '../utils/distance';
// import StylistMap from '../components/StylistMap';

// export default function HairstyleStylists() {
//   const { hairStyleId } = useParams(); // route: /hairstyles/:hairStyleId
//   const { coords: userLocation, status: locStatus, error: locError } = useUserLocation();

//   const [stylists, setStylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [query, setQuery] = useState('');

//   useEffect(() => {
//     let isMounted = true;
//     setLoading(true);
//     setErr(null);

//     getStylistsByHairStyle(hairStyleId)
//       .then((rows) => {
//         if (!isMounted) return;

//         // Normalize fields -> adjust to match your RegisterResponseDto / GetUserResponseDto
//         const normalized = rows.map((r) => {
//           const lat = Number(r.lat ?? r.latitude ?? r.location?.lat ?? r.geo?.lat);
//           const lng = Number(r.lng ?? r.longitude ?? r.location?.lng ?? r.geo?.lng);

//           return {
//             id: r.id || r.userId,
//             name: r.businessName || r.displayName || `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim(),
//             phoneNumber: r.phoneNumber || r.phone,
//             lat: Number.isFinite(lat) ? lat : undefined,
//             lng: Number.isFinite(lng) ? lng : undefined,
//             raw: r,
//           };
//         });

//         setStylists(normalized);
//       })
//       .catch((e) => setErr(e.message || 'Failed to load stylists'))
//       .finally(() => isMounted && setLoading(false));

//     return () => {
//       isMounted = false;
//     };
//   }, [hairStyleId]);

//   const withDistance = useMemo(() => {
//     return stylists.map((s) => {
//       const d =
//         userLocation && Number.isFinite(s.lat) && Number.isFinite(s.lng)
//           ? distanceKm(userLocation, { lat: s.lat, lng: s.lng })
//           : null;
//       return { ...s, distanceKm: d };
//     });
//   }, [stylists, userLocation]);

//   const filtered = useMemo(() => {
//     const base = withDistance;
//     const q = query.trim().toLowerCase();
//     const f = q
//       ? base.filter((s) => (s.name || '').toLowerCase().includes(q))
//       : base;

//     // Sort: distance asc, then name
//     return f.sort((a, b) => {
//       const da = a.distanceKm ?? Number.POSITIVE_INFINITY;
//       const db = b.distanceKm ?? Number.POSITIVE_INFINITY;
//       if (da !== db) return da - db;
//       return (a.name || '').localeCompare(b.name || '');
//     });
//   }, [withDistance, query]);

//   return (
//     <div style={{ maxWidth: 1080, margin: '24px auto', padding: 16 }}>
//       <h1 style={{ marginBottom: 8 }}>Stylists for hairstyle: {hairStyleId}</h1>

//       <div style={{ marginBottom: 12, fontSize: 14, opacity: 0.8 }}>
//         {locStatus === 'loading' && 'Detecting your location…'}
//         {locStatus === 'error' && (
//           <span>
//             Couldn’t get your location{locError ? `: ${locError}` : ''}. Distances will be hidden.
//           </span>
//         )}
//       </div>

//       <StylistMap userLocation={userLocation} stylists={filtered} />

//       <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
//         <input
//           placeholder="Search stylist name…"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           style={{
//             flex: 1,
//             padding: '10px 12px',
//             borderRadius: 12,
//             border: '1px solid #ddd',
//             outline: 'none',
//           }}
//         />
//         <span style={{ fontSize: 14, opacity: 0.8 }}>
//           {filtered.length} result{filtered.length === 1 ? '' : 's'}
//         </span>
//       </div>

//       {loading && <p style={{ marginTop: 16 }}>Loading stylists…</p>}
//       {err && (
//         <div style={{ color: 'crimson', marginTop: 16 }}>
//           Failed to load stylists: {err}
//         </div>
//       )}

//       <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
//         {filtered.map((s) => (
//           <li
//             key={s.id}
//             style={{
//               padding: 12,
//               border: '1px solid #eee',
//               borderRadius: 12,
//               marginBottom: 10,
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               gap: 12,
//             }}
//           >
//             <div>
//               <div style={{ fontWeight: 600 }}>{s.name || 'Stylist'}</div>
//               {Number.isFinite(s.distanceKm) ? (
//                 <div style={{ fontSize: 13, opacity: 0.8 }}>
//                   {s.distanceKm.toFixed(1)} km away
//                 </div>
//               ) : (
//                 <div style={{ fontSize: 13, opacity: 0.6 }}>Distance unavailable</div>
//               )}
//               {s.phoneNumber && (
//                 <div style={{ fontSize: 13, opacity: 0.8 }}>📞 {s.phoneNumber}</div>
//               )}
//             </div>

//             {Number.isFinite(s.lat) && Number.isFinite(s.lng) && (
//               <a
//                 href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ textDecoration: 'none', fontWeight: 600 }}
//               >
//                 Directions →
//               </a>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { client } from "../api/client";

function HairstyleStylists({ hairStyleId }) {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await client.get(`/hairstylists/${hairStyleId}`);
        setStylists(response.data.data); // assuming ApiResponse wraps in `.data`
      } catch (error) {
        console.error("Error fetching stylists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, [hairStyleId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Stylists for this hairstyle</h2>
      {stylists.length === 0 ? (
        <p>No stylists found</p>
      ) : (
        <ul>
          {stylists.map((s) => (
            <li key={s.id}>
              {s.name} – {s.distanceInKm} km away
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HairstyleStylists;

import React, { useEffect, useState } from "react";
import apiClient from "../api/client"; // ✅ Rename to match your convention

function HairstyleStylists({ hairStyleId }) {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStylists = async () => {
      if (!hairStyleId) {
        setError("Invalid hairstyle ID.");
        setLoading(false);
        return;
      }

      try {
        // ✅ Use apiClient for consistent headers, token, and baseURL
        const response = await apiClient.get(`/hairstylists/${hairStyleId}`);
        const result = response.data;

        if (result.succeeded && Array.isArray(result.data)) {
          setStylists(result.data);
        } else if (Array.isArray(result)) {
          // fallback in case API returns a raw array
          setStylists(result);
        } else {
          setError(result.message || "No stylists found for this hairstyle.");
        }
      } catch (err) {
        console.error("❌ Error fetching stylists:", err);
        setError("Failed to load stylists. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, [hairStyleId]);

  if (loading) return <p>Loading stylists...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="stylists-container">
      <h2>Stylists for this Hairstyle</h2>

      {stylists.length === 0 ? (
        <p>No stylists available for this hairstyle.</p>
      ) : (
        <ul className="stylist-list">
          {stylists.map((stylist) => (
            <li key={stylist.id}>
              <strong>{stylist.name}</strong> – {stylist.distanceInKm} km away
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HairstyleStylists;

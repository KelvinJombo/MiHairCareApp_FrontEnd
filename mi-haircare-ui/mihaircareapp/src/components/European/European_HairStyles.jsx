import React, { useEffect, useState } from "react";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import "../../../src/pages/CSS/StylesCategory.css";
import banner_image from "../assets/images/fullbrownie.webp";

export default function EuropeanHairstyles() {
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEuropeanHairstyles = async () => {
      try {
        const response = await fetch(
          "https://localhost:7261/api/HairStyles/all-European"
        );
        const result = await response.json();

        if (result && result.succeeded && Array.isArray(result.data)) {
          setHairstyles(result.data);
        } else {
          setError("Unexpected response format from server.");
        }
      } catch (err) {
        console.error("Error fetching European hairstyles:", err);
        setError("Failed to load European hairstyles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEuropeanHairstyles();
  }, []);

  return (
    <div className="hairstyles-page">
      {/* ✅ Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1>Welcome to European Hairstyles</h1>
          <p>Explore elegant and timeless European-inspired hair designs.</p>
          <div className="banner-images">
            <img src={banner_image} alt="European Hairstyles Banner" />
          </div>
        </div>
      </section>

      {/* ✅ Hairstyle Listing Section */}
      <section className="hairstyles-list">
        <h2 className="hairstyles-title">European Hairstyles</h2>

        {loading ? (
          <p>Loading hairstyles...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : hairstyles.length > 0 ? (
          <HairstyleGrid items={hairstyles} />
        ) : (
          <p>No European hairstyles available at the moment.</p>
        )}
      </section>
    </div>
  );
}

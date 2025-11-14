import React, { useEffect, useState } from "react";
import client from "../../api/client";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import "../../../src/pages/CSS/StylesCategory.css";
import BannerImage from "../assets/images/pretty.avif";

export default function Asian_HairStyles() {
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsianHairstyles = async () => {
      try {
        const response = await client.get("/HairStyles/all-Asian");
        const result = await response.data();

        if (result && result.succeeded && Array.isArray(result.data)) {
          setHairstyles(result.data);
        } else {
          setError("Unexpected response format from server.");
        }
      } catch (err) {
        console.error("Error fetching hairstyles:", err);
        setError("Failed to load hairstyles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsianHairstyles();
  }, []);

  return (
    <div className="hairstyles-page">
      {/* ✅ Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1>Explore Trendy Asian Hairstyles</h1>
          <p>
            Discover stylish and modern looks that reflect creativity, elegance,
            and cultural uniqueness.
          </p>
          <div className="banner-images">
            <img src={BannerImage} alt="Asian Hairstyles Banner" />
          </div>
        </div>
      </section>

      {/* ✅ Hairstyle Listing Section */}
      <section className="hairstyles-list">
        <h2 className="hairstyles-title">Asian Hairstyles</h2>

        {loading ? (
          <p>Loading hairstyles...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : hairstyles.length > 0 ? (
          <HairstyleGrid items={hairstyles} />
        ) : (
          <p>No Asian hairstyles available at the moment.</p>
        )}
      </section>
    </div>
  );
}

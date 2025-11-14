import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import "./African_HairStyles.css";
import BannerImage from "../assets/images/sampleAfrik.jpeg";

export default function AfricanHairstyles() {
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch African hairstyles
  useEffect(() => {
    const fetchAfricanHairstyles = async () => {
      try {
        const response = await client.get("/HairStyles/all-African");
        const result = await response.data();

        // Ensure the data is an array
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

    fetchAfricanHairstyles();
  }, []);

  return (
    <div className="african-page">
      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          <h1>Discover African Hairstyles</h1>
          <p>
            From braids to dreadlocks — explore traditional and modern African
            styles that inspire beauty and culture.
          </p>
        </div>
        <div className="banner-image">
          <img src={BannerImage} alt="African Hairstyles Banner" />
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <h2>Categories</h2>
        <div className="category-grid">
          <Link to="/hairstyles/african/braids" className="category-card">
            <h3>Braids</h3>
            <p>Explore African braid styles</p>
          </Link>
          <Link to="/hairstyles/african/weaves" className="category-card">
            <h3>Weaves</h3>
            <p>Discover African weave styles</p>
          </Link>
          <Link to="/hairstyles/african/dreadlocks" className="category-card">
            <h3>Dreadlocks</h3>
            <p>See African dreadlock styles</p>
          </Link>
        </div>
      </section>

      {/* Hairstyles Section */}
      <section className="section">
        <h2>Available African Hairstyles</h2>

        {loading ? (
          <p>Loading hairstyles...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : hairstyles.length > 0 ? (
          <div className="hairstyles-grid">
            {hairstyles.map((style, index) => (
              <div key={index} className="hairstyle-card">
                <h3>{style.styleName}</h3>
                <p>{style.description}</p>
                <p>
                  <strong>₦{style.priceTag.toLocaleString()}</strong>
                </p>
                {style.promotionalOffer && <span className="offer-badge">Promo!</span>}
              </div>
            ))}
          </div>
        ) : (
          <p>No African hairstyles available right now.</p>
        )}
      </section>
    </div>
  );
}

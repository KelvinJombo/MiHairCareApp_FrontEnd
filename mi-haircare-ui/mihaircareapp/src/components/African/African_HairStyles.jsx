import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import apiClient from "../../api/client";
import "../African/African_HairStyles.css";
import BannerImage from "../assets/images/woman-3153999_1280.jpg";


export default function AfricanHairstyles() {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAfrican = async () => {
      try {
        const response = await apiClient.get("/HairStyles/all-African");
        const result = response.data;

        if (result.succeeded && Array.isArray(result.data)) {
          setStyles(result.data);
        } else {
          setError("Unexpected response from server.");
        }
      } catch (err) {
        setError("Failed to load hairstyles.");
      } finally {
        setLoading(false);
      }
    };

    fetchAfrican();
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

      {/* Category Links (PRESERVED!) */}
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

      {/* Hairstyles */}
      <section className="section">
        <h2>Available African Hairstyles</h2>

        {loading && <p>Loading hairstyles...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && <HairstyleGrid items={styles} />}
      </section>

    </div>
  );
}

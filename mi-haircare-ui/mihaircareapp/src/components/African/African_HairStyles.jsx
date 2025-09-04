import React from "react";
import { Link } from "react-router-dom";
import "./African_HairStyles.css"
import BannerImage from "../assets/images/sampleAfrik.jpeg"; 

export default function AfricanHairstyles() {
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

      {/* Category Grid */}
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
    </div>
  );
}

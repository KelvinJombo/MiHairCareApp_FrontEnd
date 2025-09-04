import React from "react";
import { Link } from "react-router-dom";
import haircutzData from "../assets/haircutz_data";
import BannerImage from "../assets/images/SunnyDreads.jpeg";
import "./HairCutz.css";

const HairCutz = () => {
  return (
    <div className="haircutz-page">
      {/* ✅ Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1>Discover Stylish Haircutz</h1>
          <p>Fresh fades, classic trims, and trendy cuts — find your perfect style.</p>
          <div className="banner-images">
            <img src={BannerImage} alt="Haircutz Banner" />
          </div>
        </div>
      </section>

      {/* ✅ Haircutz Grid */}
      <section className="haircutz-list">
        {haircutzData.map((style) => (
          <div key={style.id} className="haircutz-card">
            {/* 👇 Always route to booking page for now */}
            <Link to="/booking">
              <img
                src={style.image}
                alt={style.name}
                className="haircutz-image"
              />
              <div className="haircutz-content">
                <h2>{style.name}</h2>
                <p>{style.description}</p>
                <span className="price">{style.price}</span>
              </div>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HairCutz;

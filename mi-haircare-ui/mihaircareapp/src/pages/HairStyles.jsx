import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import envogueData from "../components/assets/envogue_data";
import HairstyleCard from "../components/HairStyleCard/HairStyleCard";
import "./CSS/HairStyles.css";
import BannerImage from "../components/assets/images/curlybraids.webp";

const categories = [
  { name: "African Hair Styles", path: "/hairstyles/african" },
  { name: "DreadLocs HairStyles", path: "/hairstyles/african/dreadlocks" },
  { name: "European Hairstyles", path: "/hairstyles/european" },
  { name: "Asian Hairstyles", path: "/hairstyles/asian" },
  { name: "American Hairstyles", path: "/hairstyles/american" },
  { name: "Haircutz", path: "/hairstyles/haircutz" },
];

const HairStyles = () => {
  const { category } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  // If category param exists but not envogue → Show placeholder
  if (category && category !== "envogue") {
    return (
      <div className="hairstyles-category-page">
        <h2>{category.toUpperCase()} Hairstyles</h2>
        <p>
          Collections of <strong>{category}</strong> hairstyles will be
          available soon.
        </p>
      </div>
    );
  }

  // Default page → show Envogue hairstyles
  return (
    <div className="hairstyles-container">
      {/* ✅ Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1>Welcome to Envogue Hairstyles</h1>
          <p>
            Explore fashionable and trendy hairstyles that define modern beauty
            and creativity.
          </p>
        </div>
        <div className="banner-image">
          <img src={BannerImage} alt="Envogue Hairstyles Banner" />
        </div>
      </section>

      {/* ✅ Header + Hamburger */}
      <div className="hairstyles-header">
        <h2 className="hairstyles-title">Envogue Hairstyles</h2>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="dropdown-menu">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={cat.path}
                className="dropdown-link"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Envogue Hairstyles Grid */}
      <div className="hairstyles-grid">
        {envogueData.map((style) => (
          <HairstyleCard
            key={style.id}
            image={style.image}
            name={style.name}
            description={style.description}
            price={style.price}
          />
        ))}
      </div>
    </div>
  );
};

export default HairStyles;

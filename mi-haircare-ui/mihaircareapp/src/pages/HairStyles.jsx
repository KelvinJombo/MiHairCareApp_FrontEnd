import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Hairstyles from API
  useEffect(() => {
    const fetchHairstyles = async () => {
      try {
        const response = await fetch("https://localhost:7261/api/HairStyles/all-HairStyles");
        const result = await response.json();
  
        console.log("✅ API Response:", result);
  
        // ✅ Get the array from result.data
        if (Array.isArray(result.data)) {
          setHairstyles(result.data);
        } else {
          console.error("Unexpected response format:", result);
          setHairstyles([]); // fallback to empty
        }
      } catch (err) {
        console.error("Error fetching hairstyles:", err);
        setError("Failed to load hairstyles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchHairstyles();
  }, []);
  
  // ✅ Handle Category Pages
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

  // ✅ Loading & Error States
  if (loading) {
    return <p className="loading-text">Loading hairstyles...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  // ✅ Default Envogue / All Hairstyles Page
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

      {/* ✅ Hairstyles Grid */}
      <div className="hairstyles-grid">
        {hairstyles.map((style) => (
          <HairstyleCard
            key={style.id}
            image={style.photos?.[0]?.url || "/placeholder.jpg"}
            name={style.styleName}
            description={style.description}
            price={style.priceTag}
          />
        ))}
      </div>
    </div>
  );
};

export default HairStyles;

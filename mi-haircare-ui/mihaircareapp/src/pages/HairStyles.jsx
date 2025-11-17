import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import HairstyleCard from "../components/HairStyleCard/HairStyleCard";
import apiClient from "../api/client";
import "./CSS/HairStyles.css";
import BannerImage from "../components/assets/images/curlybraids.webp";

const HairStyles = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { name: "African Hair Styles", path: "/hairstyles/african" },
    { name: "DreadLocs HairStyles", path: "/hairstyles/african/dreadlocks" },
    { name: "European Hairstyles", path: "/hairstyles/european" },
    { name: "Asian Hairstyles", path: "/hairstyles/asian" },
    { name: "American Hairstyles", path: "/hairstyles/american" },
    { name: "Haircutz", path: "/hairstyles/haircutz" },
  ];

  useEffect(() => {
    const fetchHairstyles = async () => {
      try {
        const response = await apiClient.get("/HairStyles/all-HairStyles");
        const result = response.data;

        if (result.succeeded && Array.isArray(result.data)) {
          setHairstyles(result.data);
        } else {
          setHairstyles([]);
        }
      } catch (err) {
        setError("Failed to load hairstyles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHairstyles();
  }, []);

  if (category && category !== "envogue") {
    return (
      <div className="hairstyles-category-page">
        <h2>{category.toUpperCase()} Hairstyles</h2>
        <p>
          Collections of <strong>{category}</strong> hairstyles will be available soon.
        </p>
      </div>
    );
  }

  if (loading) return <p className="loading-text">Loading hairstyles...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="hairstyles-container">
      {/* Admin Button */}
      <button
        className="admin-button"
        onClick={() => navigate("/admin/haircare")}
      >
        Admin Dashboard
      </button>

      {/* Banner */}
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

      {/* Header + Hamburger */}
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

      {/* Hairstyles Grid */}
      <div className="hairstyles-grid">
        {hairstyles.map((style) => (
          <HairstyleCard key={style.hairStyleId} style={style} />
        ))}
      </div>
    </div>
  );
};

export default HairStyles;

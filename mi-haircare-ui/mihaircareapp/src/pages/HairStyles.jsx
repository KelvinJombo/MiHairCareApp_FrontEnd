import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import HairstyleCard from "../components/HairStyleCard/HairStyleCard";
import HairStyleActionsModal from "../components/Modals/HairStyleActionsModal";
import ViewDetailsModal from "../components/Modals/ViewDetailsModal";
import ViewStylistsModal from "../components/Modals/ViewStylistsModal";
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

  const [selectedStyle, setSelectedStyle] = useState(null);

  const [photos, setPhotos] = useState([]);

  const [stylists, setStylists] = useState([]);

  const [actionsOpen, setActionsOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [stylistsOpen, setStylistsOpen] = useState(false);

  const [detailsError, setDetailsError] = useState("");

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

        if (result.succeeded) {
          setHairstyles(result.data);
        }
      } catch (err) {
        setError("Failed to load hairstyles.");
      } finally {
        setLoading(false);
      }
    };

    fetchHairstyles();
  }, []);

  /* VIEW DETAILS */
  const handleViewDetails = async () => {
    if (!selectedStyle) return;

    setDetailsError("");

    try {
      const response = await apiClient.get(
        `/HairStyles/getHairStylePhotos/${selectedStyle.hairStyleId}`
      );

      const result = response.data;

      if (
        result.succeeded &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        setPhotos(result.data);
      } else {
        setPhotos([]);

        setDetailsError(
          "No hairstyle photos are available for this style yet."
        );
      }

      setActionsOpen(false);

      setDetailsOpen(true);
    } catch (error) {
      console.error("Failed to fetch hairstyle photos", error);

      setPhotos([]);

      setDetailsError("Failed to load hairstyle photos. Please try again.");

      setActionsOpen(false);

      setDetailsOpen(true);
    }
  };

  /* VIEW STYLISTS */
  const handleViewStylists = async () => {
    try {
      const response = await apiClient.get(
        `/stylists/hairstylists/${selectedStyle.hairStyleId}`
      );

      const result = response.data;

      if (result.succeeded) {
        setStylists(result.data);
      } else {
        setStylists([]);
      }

      setActionsOpen(false);

      setStylistsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading hairstyles...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="hairstyles-container">
      {/* ADMIN BUTTON */}
      <button
        className="admin-button"
        onClick={() => navigate("/admin/haircare")}
      >
        Admin Dashboard
      </button>

      {/* BANNER */}
      <section className="banner">
        <div className="banner-content">
          <h1>Welcome to Envogue Hairstyles</h1>

          <p>Explore fashionable and trendy hairstyles.</p>
        </div>

        <div className="banner-image">
          <img src={BannerImage} alt="Envogue Hairstyles Banner" />
        </div>
      </section>

      {/* HEADER */}
      <div className="hairstyles-header">
        <h2 className="hairstyles-title">Envogue Hairstyles</h2>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
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

      {/* HAIRSTYLES GRID */}
      <div className="hairstyles-grid">
        {hairstyles.map((style) => (
          <HairstyleCard
            key={style.hairStyleId}
            style={style}
            onSelect={(selected) => {
              setSelectedStyle(selected);
              setActionsOpen(true);
            }}
          />
        ))}
      </div>

      {/* ACTION MODAL */}
      <HairStyleActionsModal
        isOpen={actionsOpen}
        onClose={() => setActionsOpen(false)}
        onDetails={handleViewDetails}
        onStylists={handleViewStylists}
      />

      {/* DETAILS MODAL */}
      <ViewDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onBack={() => {
          setDetailsOpen(false);
          setActionsOpen(true);
        }}
        style={selectedStyle}
        photos={photos}
        errorMessage={detailsError}
      />

      {/* STYLISTS MODAL */}
      <ViewStylistsModal
        isOpen={stylistsOpen}
        onClose={() => setStylistsOpen(false)}
        onBack={() => {
          setStylistsOpen(false);
          setActionsOpen(true);
        }}
        stylists={stylists}
        style={selectedStyle}
      />
    </div>
  );
};

export default HairStyles;

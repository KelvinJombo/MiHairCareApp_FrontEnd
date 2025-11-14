import React, { useEffect, useState } from "react";
import client from "../../api/client";
import { Link } from "react-router-dom";
import BannerImage from "../assets/images/SunnyDreads.jpeg";
import "./HairCutz.css";

const HairCutz = () => {
  const [haircuts, setHaircuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHaircuts = async () => {
      try {
        const response = await client.get("/HairStyles/haircutz"); // Adjust endpoint to your backend
        const result = response.data;

        if (result.succeeded && result.data) {
          setHaircuts(result.data);
        } else {
          setError(result.message || "Failed to fetch Haircutz.");
        }
      } catch (err) {
        console.error("❌ Error fetching Haircutz:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchHaircuts();
  }, []);

  if (loading) return <p className="loading-text">Loading Haircutz...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="haircutz-page">
      {/* ✅ Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1>Discover Stylish Haircutz</h1>
          <p>
            Fresh fades, classic trims, and trendy cuts — find your perfect
            style.
          </p>
          <div className="banner-images">
            <img src={BannerImage} alt="Haircutz Banner" />
          </div>
        </div>
      </section>

      {/* ✅ Haircutz Grid */}
      <section className="haircutz-list">
        {haircuts.length > 0 ? (
          haircuts.map((style) => (
            <div key={style.id} className="haircutz-card">
              <Link to={`/booking/${style.id}`}>
                <img
                  src={style.imageUrl || "/placeholder.jpg"}
                  alt={style.styleName}
                  className="haircutz-image"
                />
                <div className="haircutz-content">
                  <h2>{style.styleName}</h2>
                  <p>{style.description}</p>
                  <span className="price">{style.priceTag || "N/A"}</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No Haircutz available at the moment.</p>
        )}
      </section>
    </div>
  );
};

export default HairCutz;

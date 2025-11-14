import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import BannerImage from "../components/assets/images/care_products/hair-extensions/Hairs.jpeg";
import apiClient from "../api/client";
import "./CSS/Extensions.css";

const Extensions = () => {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const response = await apiClient.get("/Products/extensions");
        const result = response.data;
        if (result?.succeeded && Array.isArray(result.data)) {
          setExtensions(result.data);
        } else if (Array.isArray(result)) {
          setExtensions(result);
        } else {
          setError(result?.message || "Failed to fetch extensions.");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchExtensions();
  }, []);

  if (loading) return <p className="loading-text">Loading hair extensions...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="extensions-page">
      <section className="banner">
        <div className="banner-content">
          <h1>Explore Premium Hair Extensions</h1>
          <p>Wigs, Weavons, Attachments, Curls, and more – all in one place.</p>
        </div>
        <div className="banner-images">
          <img src={BannerImage} alt="Hair Extensions Banner" />
        </div>
      </section>

      <section className="extensions-list">
        {extensions.length > 0 ? (
          extensions.map((product) => (
            <ProductCard key={product.id || product.Id || product.productId || product.HaircareProductId} product={product} />
          ))
        ) : (
          <p>No extensions available at the moment.</p>
        )}
      </section>
    </div>
  );
};

export default Extensions;

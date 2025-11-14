import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import BannerImage from "../components/assets/images/care_products/gadgets/banner.avif";
import apiClient from "../api/client";
import "./CSS/Gadgets.css";

export const Gadgets = () => {
  const [gadgets, setGadgets] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        const response = await apiClient.get("/Products/gadgets");
        const result = response.data;

        if (result.succeeded && result.data) {
          // Separate gadgets and accessories
          setGadgets(
            result.data.filter(
              (item) => item.category?.toLowerCase() !== "accessory"
            )
          );
          setAccessories(
            result.data.filter(
              (item) => item.category?.toLowerCase() === "accessory"
            )
          );
        } else {
          setError(result.message || "Failed to fetch gadgets.");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchGadgets();
  }, []);

  if (loading) return <p className="loading-text">Loading hair gadgets...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="gadget-page">
      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          <h1>Explore Our Hair Care Gadgets & Accessories</h1>
          <p>
            From clippers to hair bonnets — everything you need in one place.
          </p>
        </div>
        <div className="banner-image">
          <img src={BannerImage} alt="Hair care gadgets" />
        </div>
      </section>

      {/* Gadgets */}
      <section className="section">
        <h2>Gadgets</h2>
        <div className="product-list">
          {gadgets.length > 0 ? (
            gadgets.map((product, index) => (
              <ProductCard
                key={
                  product.id ||
                  product.Id ||
                  product.productId ||
                  product.HaircareProductId
                }
                product={product}
              />
            ))
          ) : (
            <p>No gadgets available at the moment.</p>
          )}
        </div>
      </section>

      {/* Accessories */}
      {accessories.length > 0 && (
        <section className="section">
          <h2>Accessories</h2>
          <div className="product-list">
            {accessories.map((product, index) => (
              <ProductCard
                key={
                  product.id ||
                  product.Id ||
                  product.productId ||
                  product.HaircareProductId
                }
                product={product}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

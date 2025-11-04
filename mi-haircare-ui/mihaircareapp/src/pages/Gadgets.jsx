import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import BannerImage from "../components/assets/images/care_products/gadgets/banner.avif";
import "./CSS/Gadgets.css";

export const Gadgets = () => {
  const [gadgets, setGadgets] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        const response = await fetch("https://localhost:7261/api/Products/gadgets");
        const result = await response.json();

        if (result.succeeded && result.data) {
          // Separate gadgets and accessories based on product name or brand if necessary
          // For now, we’ll assume all are gadgets since API doesn’t distinguish accessories yet
          setGadgets(result.data);

          // If your API later includes accessories in the same endpoint,
          // you can categorize like:
          // setAccessories(result.data.filter(p => p.category === "Accessory"));
        } else {
          setError(result.message || "Failed to fetch gadgets.");
        }
      } catch (err) {
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
      <section className="banner">
        <div className="banner-content">
          <h1>Explore Our Hair Care Gadgets & Accessories</h1>
          <p>From clippers to hair bonnets — everything you need in one place.</p>
        </div>
        <div className="banner-image">
          <img src={BannerImage} alt="Hair care gadgets" />
        </div>
      </section>

      <section className="section">
        <h2>Gadgets</h2>
        <div className="product-list">
          {gadgets.length > 0 ? (
            gadgets.map((product, index) => (
              <ProductCard
                key={index}
                product={{
                  id: index,
                  name: product.productName,
                  brand: product.brand,
                  price: product.price,
                  image: product.imageUrl,
                }}
              />
            ))
          ) : (
            <p>No gadgets found.</p>
          )}
        </div>
      </section>

      {accessories.length > 0 && (
        <section className="section">
          <h2>Accessories</h2>
          <div className="product-list">
            {accessories.map((product, index) => (
              <ProductCard
                key={index}
                product={{
                  id: index,
                  name: product.productName,
                  brand: product.brand,
                  price: product.price,
                  image: product.imageUrl,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

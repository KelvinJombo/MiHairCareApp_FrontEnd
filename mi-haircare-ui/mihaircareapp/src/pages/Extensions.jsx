import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import BannerImage from "../components/assets/images/care_products/hair-extensions/Hairs.jpeg";
import "./CSS/Extensions.css";

const Extensions = () => {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const response = await fetch(
          "https://localhost:7261/api/Products/extensions"
        );
        const result = await response.json();

        if (result.succeeded && result.data) {
          setExtensions(result.data);
        } else {
          setError(result.message || "Failed to fetch extensions.");
        }
      } catch (err) {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchExtensions();
  }, []);

  if (loading)
    return <p className="loading-text">Loading hair extensions...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="extensions-page">
      {/* ✅ Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1>Explore Premium Hair Extensions</h1>
          <p>Wigs, Weavons, Attachments, Curls, and more – all in one place.</p>
        </div>
        <div className="banner-images">
          <img src={BannerImage} alt="Hair Extensions Banner" />
        </div>
      </section>

      {/* ✅ Extensions Product List */}
      <section className="extensions-list">
        {extensions.length > 0 ? (
          extensions.map((product, index) => (
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
          <p>No extensions available at the moment.</p>
        )}
      </section>
    </div>
  );
};

export { Extensions };

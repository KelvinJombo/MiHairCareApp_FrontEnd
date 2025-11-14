import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import apiClient from "../api/client";
import "../pages/CSS/ProductPages.css";

const Growth = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrowthProducts = async () => {
      try {
        const response = await apiClient.get("/Products/growth");
        const result = response.data;

        if (result?.succeeded && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          setError(
            result?.message || "Unexpected response format from server."
          );
        }
      } catch (err) {
        console.error("❌ Error fetching Growth products:", err);
        setError("Failed to load Growth products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrowthProducts();
  }, []);

  return (
    <div className="product-page">
      <h2>Hair Growth Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.id || product.Id || product.haircareProductId}
              product={{
                ...product,
                Id: product.Id || product.id || product.haircareProductId,
                StockQuantity:
                  product.StockQuantity || product.stockQuantity || 1,
              }}
            />
          ))}
        </div>
      ) : (
        <p>No Growth products available at the moment.</p>
      )}
    </div>
  );
};

export default Growth;

import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import client from "../api/client";
import "../pages/CSS/ProductPages.css";

const Treatment = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await client.get("/Products/treatment");  
        const result = response.data;

        if (result.succeeded && result.data) {
          setProducts(result.data);
        } else {
          setError(result.message || "Failed to fetch treatment products.");
        }
      } catch (err) {
        console.error("❌ Error fetching treatment products:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <p className="loading-text">Loading treatment products...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="product-page">
      <h2>Hair Treatment Products</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map(
            (
              product,
              index //
            ) => (
              <ProductCard
                key={
                  product.id ||
                  product.Id ||
                  product.productId ||
                  product.HaircareProductId
                }
                product={product}
              />
            )
          )
        ) : (
          <p>No treatment products available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Treatment;

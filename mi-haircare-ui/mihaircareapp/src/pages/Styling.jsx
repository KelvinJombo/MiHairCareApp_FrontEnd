import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import client from "../api/client"; // ✅ Use your centralized axios instance
import "../pages/CSS/ProductPages.css";

const Styling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ Use apiClient instead of fetch
        const response = await client.get("/Products/styling");
        const result = response.data;

        if (result.succeeded && result.data) {
          setProducts(result.data);
        } else {
          setError(result.message || "Failed to fetch styling products.");
        }
      } catch (err) {
        console.error("❌ Error fetching styling products:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <p className="loading-text">Loading styling products...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="product-page">
      <h2>Hair Styling Products</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product, index) => (
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
          <p>No treatment products available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Styling;

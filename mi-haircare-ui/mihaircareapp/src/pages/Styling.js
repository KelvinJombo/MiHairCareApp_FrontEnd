import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import "../pages/CSS/ProductPages.css";

const Styling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://localhost:7261/api/Products/styling");
        const result = await response.json();

        if (result.succeeded && result.data) {
          setProducts(result.data);
        } else {
          setError(result.message || "Failed to fetch styling products.");
        }
      } catch (err) {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="loading-text">Loading styling products...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="product-page">
      <h2>Hair Styling Products</h2>
      <div className="product-list">
        {products.map((product, index) => (
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
    </div>
  );
};

export default Styling;

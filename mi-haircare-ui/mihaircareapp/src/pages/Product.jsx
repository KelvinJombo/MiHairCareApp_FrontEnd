import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrum } from "../components/Breadcrum/Breadcrum";
import { ProductDisplay } from "../components/ProductDisplay/ProductDisplay";
import apiClient from "../api/client"; // ✅ Use centralized API client

export const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        // ✅ Use your reusable apiClient for consistency
        const response = await apiClient.get(`/products/getById/${productId}`);
        const result = response.data;

        if (result.succeeded && result.data) {
          setProduct(result.data);
        } else {
          setError(result.message || "Failed to fetch product details.");
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Unable to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ✅ Handle loading and error states clearly
  if (loading)
    return <p className="loading-text">Loading product details...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-page">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
    </div>
  );
};

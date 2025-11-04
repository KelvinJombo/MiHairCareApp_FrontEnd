import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrum } from "../components/Breadcrum/Breadcrum";
import { ProductDisplay } from "../components/ProductDisplay/ProductDisplay";

export const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ✅ Adjust your API to match your product detail endpoint
        const response = await fetch(`https://localhost:7261/api/Products/getById/${productId}`);         
        const result = await response.json();

        if (result.succeeded && result.data) {
          setProduct(result.data);
        } else {
          console.error("Failed to load product:", result.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
    </div>
  );
};

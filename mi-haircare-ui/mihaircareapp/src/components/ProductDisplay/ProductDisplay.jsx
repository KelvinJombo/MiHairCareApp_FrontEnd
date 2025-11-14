import React, { useState } from "react";  
import "./ProductDisplay.css";
import { useContext } from "react";
import CartContext from "../../Context/CartContext";



export const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    if (!product) return;

    setAdding(true);
    setError("");

    try {
      await addToCart({
        id: product.id,
        name: product.productName,
        brand: product.brand,
        price: product.price,
        image: product.imageUrl,
        quantity: 1, // ✅ Default to 1 for now
      });
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="productdisplay">
      {/* ✅ Left Section - Product Images */}
      <div className="productdisplay-left">
        <div className="productdisplay-image-list">
          <img src={product.imageUrl} alt={product.productName} />
          <img src={product.imageUrl} alt={product.productName} />
          <img src={product.imageUrl} alt={product.productName} />
          <img src={product.imageUrl} alt={product.productName} />
        </div>
        <div className="productdisplay-image">
          <img
            className="productdisplay-main-img"
            src={product.imageUrl}
            alt={product.productName}
          />
        </div>
      </div>

      {/* ✅ Right Section - Product Info */}
      <div className="productdisplay-right">
        <h1>{product.productName}</h1>
        <p className="productdisplay-brand">Brand: {product.brand}</p>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-new">₦{product.price}</div>
        </div>

        <p className="productdisplay-right-description">
          {product.description || "No description available."}
        </p>

        <p
          className={`productdisplay-right-stock ${
            product.stockQuantity > 0 ? "in-stock" : "out-of-stock"
          }`}
        >
          {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={adding || product.stockQuantity === 0}
        >
          {adding ? "Adding..." : "Add to Cart 🛒"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

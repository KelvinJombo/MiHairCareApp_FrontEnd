// src/components/ProductCard/ProductCard.js
import React, { useContext } from "react";
import CartContext from "../../Context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name || product.productName} />
      <h3>{product.productName}</h3>
      <p>₦{product.price}</p>
      <button className="add-btn" onClick={() => addToCart(product)}>
        Add to Cart 🛒
      </button>
    </div>
  );
};

export default ProductCard;

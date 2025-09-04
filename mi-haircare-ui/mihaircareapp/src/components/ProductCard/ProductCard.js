import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={product.image} alt={product.productName} className="product-image" />
    <div className="product-info">
      <h3 className="product-name">{product.productName}</h3>
      <p className="product-description">{product.shortDescription}</p>
      <p className="product-brand"><strong>Brand:</strong> {product.companyName}</p>
      <p className="product-price">{product.productPrice}</p>
    </div>
  </div>
);

export default ProductCard;

import React from "react";
import growthProducts from "../components/assets/growth_products_data";
import ProductCard from "../components/ProductCard/ProductCard";
import "../pages/ProductPages.css";

const Growth = () => (
  <div className="product-page">
    <h2>Hair Growth Products</h2>
    <div className="product-list">
      {growthProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

export default Growth;

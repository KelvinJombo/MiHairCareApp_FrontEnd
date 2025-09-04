import React from "react";
import treatmentProducts from "../components/assets/treatment_products_data";
import ProductCard from "../components/ProductCard/ProductCard";
import "../pages/ProductPages.css";

const Treatment = () => (
  <div className="product-page">
    <h2>Hair Treatment Products</h2>
    <div className="product-list">
      {treatmentProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

export default Treatment;

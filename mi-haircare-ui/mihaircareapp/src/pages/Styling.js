import React from "react";
import stylingProducts from "../components/assets/styling_products_data";
import ProductCard from "../components/ProductCard/ProductCard";
import "../pages/ProductPages.css";

const Styling = () => (
  <div className="product-page">
    <h2>Hair Styling Products</h2>
    <div className="product-list">
      {stylingProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

export default Styling;

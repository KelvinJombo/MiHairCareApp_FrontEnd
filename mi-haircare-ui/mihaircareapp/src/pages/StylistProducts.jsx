import React from "react";
import { Link } from "react-router-dom";
import "./CSS/StylistProducts.css";

const StylistProducts = () => {
  return (
    <div className="home">
      <h2>Explore Our Categories</h2>
      <div className="home-categories">
        <Link to="/care-products" className="home-category-card">
          Care Products
        </Link>
        <Link to="/gadgets" className="home-category-card">
          Gadgets & Accessories
        </Link>
        <Link to="/extensions" className="home-category-card">
          Hair Extensions
        </Link>
      </div>
    </div>
  );
};

export default StylistProducts;

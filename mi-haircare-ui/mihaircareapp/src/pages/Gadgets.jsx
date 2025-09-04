import React from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import gadgetsData from "../components/assets/gadgets_data";
import BannerImage from "../components/assets/images/care_products/gadgets/banner.avif"
import "./CSS/Gadgets.css";

export const Gadgets = () => {
  const gadgets = gadgetsData.filter(item => item.type === "gadget");
  const accessories = gadgetsData.filter(item => item.type === "accessory");

  return (
    <div className="gadget-page">
      <section className="banner">
        <div className="banner-content">
          <h1>Explore Our Hair Care Gadgets & Accessories</h1>
          <p>From clippers to hair bonnets — everything you need in one place.</p>
        </div>
        <div className="banner-image">          
          <img src={BannerImage} alt="Hair care gadgets" />
        </div>
      </section>

      <section className="section">
        <h2>Gadgets</h2>
        <div className="product-list">
          {gadgets.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Accessories</h2>
        <div className="product-list">
          {accessories.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

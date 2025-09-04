import React from "react";
import extensionsData from "../components/assets/extensions_data";
import ProductCard from "../components/ProductCard/ProductCard";
import Banner_image from "../components/assets/images/care_products/hair-extensions/Hairs.jpeg";
import "./CSS/Extensions.css";

const Extensions = () => (
  <div className="extensions-page">
    <section className="banner">
      <div className="banner-content">
        <h1>Explore Premium Hair Extensions</h1>
        <p>Wigs, Weavons, Attachments, Curls, and more – all in one place.</p>        
        <div className="banner-images">
          <img src={Banner_image} alt="Banner" />
          {/* Add more images as needed */}
        </div>
      </div>
    </section>

    <section className="extensions-list">
      {extensionsData.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  </div>
);

export { Extensions };

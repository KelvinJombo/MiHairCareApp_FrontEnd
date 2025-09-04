import React from "react";
import "../../../src/pages/CSS/StylesCategory.css";

export default function HairstyleCard({ name, price, image }) {
  return (
    <div className="hairstyle-card">
      <img src={image} alt={name} className="hairstyle-image" />
      <div className="hairstyle-info">
        <h3>{name}</h3>
        {price && <p className="price">{price}</p>}
      </div>
    </div>
  );
}

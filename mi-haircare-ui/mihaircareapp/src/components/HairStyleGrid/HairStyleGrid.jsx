import React from "react";
import HairstyleCard from "../HairStyleCard/HairStyleCard";
import "../../../src/pages/CSS/StylesCategory.css";

export default function HairstyleGrid({ items = [] }) {
  return (
    <div className="hairstyle-grid">
      {items.map((item, index) => (
        <HairstyleCard
          key={item.id || index}
          name={item.name}
          price={item.price}
          image={item.image}
        />
      ))}
    </div>
  );
}

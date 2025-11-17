import React from "react";
import HairstyleCard from "../HairStyleCard/HairStyleCard";
import "../../pages/CSS/StylesCategory.css";

export default function HairstyleGrid({ items = [] }) {
  return (
    <div className="hairstyle-grid">
      {items.map((style) => (
        <HairstyleCard
          key={style.hairStyleId}
          style={style}
        />
      ))}
    </div>
  );
}

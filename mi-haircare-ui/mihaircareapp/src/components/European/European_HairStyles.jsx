import React from "react";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import { europeanStyles } from "../assets/european_data";
import "../../../src/pages/CSS/StylesCategory.css";
import banner_image from "../assets/images/fullbrownie.webp";

export default function EuropeanHairstyles() {
  return (
    <div className="hairstyles-page">
      <section className="banner">
        <div className="banner-content">
          {" "}
          {/* 👈 fixed here */}
          <h1>Welcome to European Hairstyles</h1>
          <p>Explore elegant and timeless European-inspired hair designs.</p>
          <div className="banner-images">
            <img src={banner_image} alt="European Hairstyles Banner" />
          </div>
        </div>
      </section>

      <section className="hairstyles-list">
        <h2 className="hairstyles-title">European Hairstyles</h2>
        <HairstyleGrid items={europeanStyles} />
      </section>
    </div>
  );
}

import React from "react";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import { americanStyles } from "../assets/american_data";
import "../../../src/pages/CSS/StylesCategory.css";
import BannerImage from "../assets/images/cutie.avif";

export default function AmericanHairstyles() {
  return (
    <div className="hairstyles-page">
      {/* ✅ Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1>Explore Trendy American Hairstyles</h1>
          <p>
            Discover stylish and modern looks that reflect creativity, boldness,
            and culture.
          </p>
          <div className="banner-images">
            <img src={BannerImage} alt="American Hairstyles Banner" />
          </div>
        </div>
      </section>

      {/* ✅ Hairstyle Listing */}
      <section className="hairstyles-list">
        <h2 className="hairstyles-title">American Hairstyles</h2>
        <HairstyleGrid items={americanStyles} />
      </section>
    </div>
  );
}

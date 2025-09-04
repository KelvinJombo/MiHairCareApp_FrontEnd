import React from "react";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import { asianStyles } from "../assets/asian_data";
import "../../../src/pages/CSS/StylesCategory.css";
import BannerImage from "../assets/images/pretty.avif";

export default function Asian_HairStyles() {
  return (
    <div className="hairstyles-page">
      <section className="banner">
        <div className="banner-content">
          {" "}
          {/* 👈 fixed here */}
          <h1>Explore Trendy Asian Hairstyles</h1>
          <p>
            Discover stylish and modern looks that reflect creativity, boldness,
            and culture.
          </p>
          <div className="banner-images">
            <img src={BannerImage} alt="Asian Hairstyles Banner" />
          </div>
        </div>
      </section>

      <section className="hairstyles-list">
        <h2 className="hairstyles-title">Asian Hairstyles</h2>
        <HairstyleGrid items={asianStyles} />
      </section>
    </div>
  );
}

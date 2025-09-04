import React from "react";
import weavesData from "../assets/african_styles_data";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import BannerImage from "../assets/images/sampleAfrica.jpeg";
import "../../pages/CSS/Weaves.css";

const Weaves = () => (
  <div className="weaves-page">
    {/* ✅ Banner Section */}
    <section className="banner">
      <div className="banner-content">
        <h1>Explore Elegant Weaves</h1>
        <p>Stylish and versatile weaves for every occasion.</p>
        <div className="banner-images">
          <img src={BannerImage} alt="Weaves Banner" />
        </div>
      </div>
    </section>

    {/* ✅ Weaves List */}
    <section className="weaves-list">
      <HairstyleGrid items={weavesData} />
    </section>
  </div>
);

export default Weaves;

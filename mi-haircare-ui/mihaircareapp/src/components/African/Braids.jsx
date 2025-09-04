import React from "react";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import braidsData from "../assets/braids_data";
import BannerImage from "../assets/images/braids.png";
import "../../pages/CSS/Braids.css";

const Braids = () => (
  <div className="braids-page">    
    <section className="banner">
      <div className="banner-content">
        <h1>Explore Beautiful Braids</h1>
        <p>Box Braids, Cornrows, Twists, and more.</p>
        <div className="banner-images">
          <img src={BannerImage} alt="Braids Banner" />
        </div>
      </div>
    </section>
    
    <section className="braids-list">
      <HairstyleGrid items={braidsData} />
    </section>
  </div>
);

export default Braids;

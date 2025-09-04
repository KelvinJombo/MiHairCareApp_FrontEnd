import React from "react";
import "./Hero.css";
import hand_icon from "../assets/images/care_products/Shoppingbags.jpeg";
import arrow_icon from "../assets/images/care_products/arrowicon.png";
import hero_image from "../assets/images/care_products/good.jpeg";

export const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>ONE STOP SHOP FOR HAIRCARE</h2>
        <div>
          <div className="hand-hand-icon">
            <p>Hot Sales HairCare Products</p>
            <img src={hand_icon} alt="" />
          </div>
        </div>
        <button className="hero-latest-btn">
          <div>Latest Collections</div>
          <img src={arrow_icon} alt="" />
        </button>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="Hero Hair Style" />
      </div>
    </div>
  );
};

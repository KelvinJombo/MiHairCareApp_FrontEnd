import React from "react";
import dreadsData from "../assets/dreadlocs_data";
import HairstyleCard from "../HairStyleCard/HairStyleCard";
import BannerImage from "../assets/images/BannerLocs1.jpeg";
import "../../pages/CSS/DreadLocs.css";

const DreadLocs = () => (
  <div className="dreadlocs-page">
    {/* Banner Section */}
    <section className="banner">
      <div className="banner-content">
        <h1>Explore Stylish DreadLocs</h1>
        <p>Jah Dreads, Rasta, Reggae Locs, Marlean Dreads, and more.</p>
        <div className="banner-images">
          <img src={BannerImage} alt="DreadLocs Banner" />
        </div>
      </div>
    </section>

    {/* DreadLocs List */}
    <section className="dreadlocs-list">
      {dreadsData.map((style) => (
        <HairstyleCard
          key={style.id}
          name={style.name}
          price={style.price}
          image={style.image}
        />
      ))}
    </section>
  </div>
);

export default DreadLocs;

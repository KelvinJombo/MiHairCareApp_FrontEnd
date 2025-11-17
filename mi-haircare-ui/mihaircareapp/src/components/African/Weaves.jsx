import React, { useEffect, useState } from "react";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import BannerImage from "../assets/images/sampleAfrica.jpeg";
import "../../pages/CSS/Weaves.css";

const Weaves = () => {
  const [weaves, setWeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeaves = async () => {
      try {
        const response = await fetch("https://yourapi.com/api/hairstyles/weaves");
        const data = await response.json();

        const mapped = data.map((item) => ({
          id: item.hairStyleId,
          name: item.styleName,
          price: item.priceTag,
          image: item.photos?.[0]?.url || "/placeholder.jpg",
        }));

        setWeaves(mapped);
      } catch (error) {
        console.error("Error fetching weaves:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeaves();
  }, []);

  return (
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
        {loading ? <p>Loading weaves...</p> : <HairstyleGrid items={weaves} />}
      </section>
    </div>
  );
};

export default Weaves;

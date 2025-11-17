import React, { useEffect, useState } from "react";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import BannerImage from "../assets/images/braids.png";
import "../../pages/CSS/Braids.css";

const Braids = () => {
  const [braids, setBraids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBraids = async () => {
      try {
        const response = await fetch("https://yourapi.com/api/hairstyles/braids");
        const data = await response.json();

        const mapped = data.map((item) => ({
          id: item.hairStyleId,
          name: item.styleName,
          price: item.priceTag,
          image: item.photos?.[0]?.url || "/placeholder.jpg",
        }));

        setBraids(mapped);
      } catch (error) {
        console.error("Error fetching braids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBraids();
  }, []);

  return (
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
        {loading ? <p>Loading braids...</p> : <HairstyleGrid items={braids} />}
      </section>
    </div>
  );
};

export default Braids;

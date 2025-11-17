import React, { useEffect, useState } from "react";
import HairstyleGrid from "../HairStyleGrid/HairStyleGrid";
import apiClient from "../../api/client";
import BannerImage from "../assets/images/BannerLocs1.jpeg";
import "../../pages/CSS/DreadLocs.css";

const DreadLocs = () => {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDreads = async () => {
      try {
        const response = await apiClient.get("/HairStyles/dreadlocks"); 
        const result = response.data;

        if (result.succeeded && Array.isArray(result.data)) {
          setStyles(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dreadlocks.");
      } finally {
        setLoading(false);
      }
    };

    fetchDreads();
  }, []);

  return (
    <div className="dreadlocs-page">
      <section className="banner">
        <div className="banner-content">
          <h1>Explore Stylish DreadLocs</h1>
          <p>Jah Dreads, Rasta, Reggae Locs, Marlean Dreads, and more.</p>
          <div className="banner-images">
            <img src={BannerImage} alt="DreadLocs Banner" />
          </div>
        </div>
      </section>

      <section className="dreadlocs-list">
        {loading && <p>Loading dreadlocks...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && <HairstyleGrid items={styles} />}
      </section>
    </div>
  );
};

export default DreadLocs;

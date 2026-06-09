import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StylistPortfolio.css";
import { useParams } from "react-router-dom";

export default function StylistPortfolio({ stylistId: propId = null }) {
  const { stylistId: routeId } = useParams(); // allow route-based ID: /stylist/123/portfolio
  const stylistId = propId || routeId;

  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stylistId) {
      setError("Invalid stylist ID.");
      setLoading(false);
      return;
    }

    fetchPortfolio();
  }, [stylistId]);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`/api/stylists/${stylistId}/portfolio`);
      setPortfolio(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load stylist portfolio.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="portfolio-loading">Loading portfolio...</div>;

  if (error)
    return <div className="portfolio-error">{error}</div>;

  if (portfolio.length === 0)
    return <div className="portfolio-empty">This stylist has no hairstyles added yet.</div>;

  return (
    <div className="portfolio-page">
      <h1 className="portfolio-title">Stylist Portfolio</h1>

      <div className="portfolio-grid">
        {portfolio.map((style) => {
          const image = style.photos?.[0]?.url ?? "/default.jpg";

          return (
            <div className="portfolio-card" key={style.hairStyleId}>
              <img src={image} alt={style.styleName} className="portfolio-img" />

              <div className="portfolio-info">
                <h3 className="portfolio-style-name">{style.styleName}</h3>
                <p className="portfolio-origin">{style.origin}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

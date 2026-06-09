import React, { useEffect, useState } from "react";
import apiClient from "../../api/client";

export default function StylistHairStyleSelection() {
  const [hairStyles, setHairStyles] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const stylistId = localStorage.getItem("userId");

  useEffect(() => {
    fetchHairStyles();
  }, []);

  const fetchHairStyles = async () => {
    try {
      const res = await apiClient.get("/hairstyles/stylesForPortfolio");
      console.log("HAIRSTYLES RESPONSE:", res.data);

      setHairStyles(res.data.data || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Failed to load hairstyles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedStyles.length === 0) {
      setError("Please select at least one hairstyle.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await apiClient.post(`/stylists/${stylistId}/portfolio`, {
        hairStyleIds: selectedStyles,
      });

      setMessage(res.data); // "Portfolio updated successfully."
    } catch (err) {
      console.error("SAVE ERROR:", err);
      setError(err.response?.data || "Failed to update portfolio.");
    } finally {
      setSaving(false);
    }
  };

  // Group by origin
  const grouped = Array.isArray(hairStyles)
    ? hairStyles.reduce((acc, style) => {
        const origin = style.origin || "Others";
        if (!acc[origin]) acc[origin] = [];
        acc[origin].push(style);
        return acc;
      }, {})
    : {};

  return (
    <div className="stylist-page">
      <h1>Select Hairstyles You Offer</h1>

      {loading && <p>Loading hairstyles...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {!loading && hairStyles.length === 0 && (
        <p>No hairstyles available. Please contact admin.</p>
      )}

      {!loading &&
        Object.entries(grouped).map(([origin, list]) => (
          <div key={origin} className="origin-group">
            <h2 className="origin-title">{origin}</h2>

            <div className="hairstyle-grid">
              {list.map((style) => {
                const mainPhoto =
                  style.photos?.length > 0
                    ? style.photos[0].url
                    : "/default.jpg";

                return (
                  <div key={style.hairStyleId} className="hairstyle-card">
                    <img src={mainPhoto} alt={style.styleName} />

                    <h3>{style.styleName}</h3>

                    <label className="select-box">
                      <input
                        type="checkbox"
                        checked={selectedStyles.includes(style.hairStyleId)}
                        onChange={() => toggleSelection(style.hairStyleId)}
                      />
                      <span>Select</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      <button
        onClick={handleSubmit}
        className="save-portfolio-btn"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Portfolio"}
      </button>
    </div>
  );
}

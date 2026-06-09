import React from "react";

import { useNavigate } from "react-router-dom";

import "./Modal.css";

export default function ViewStylistsModal({
  isOpen,
  onClose,
  onBack,
  stylists = [],
  style,
}) {
  const navigate = useNavigate();

  if (!isOpen || !style) return null;

  const handleBooking = (stylist) => {
    navigate(
      `/booking?stylistId=${stylist.stylistId}&hairStyleId=${style.hairStyleId}`
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box large">

        <h2>
          Stylists offering {style.styleName}
        </h2>

        <div className="stylists-grid">

          {stylists.map((stylist, index) => (
            <div
              className="stylist-card"
              key={stylist.stylistId || index}
            >
              <img
                src={stylist.photoUrl}
                alt={stylist.companyName}
                className="stylist-img"
              />

              <h3>{stylist.companyName}</h3>

              <p>
                Distance:
                {" "}
                {stylist.distanceInKm} km
              </p>

              <p>
                Rating:
                {" "}
                ⭐ {stylist.averageRating || "N/A"}
              </p>

              <p>
                ID:
                {" "}
                {stylist.stylistId}
              </p>

              <button
                className="book-stylist-btn"
                onClick={() => handleBooking(stylist)}
              >
                Book {stylist.companyName}
              </button>

            </div>
          ))}

        </div>

        <div className="modal-actions">

          <button
            className="modal-btn"
            onClick={onBack}
          >
            ← Back
          </button>

          <button
            className="modal-close"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}
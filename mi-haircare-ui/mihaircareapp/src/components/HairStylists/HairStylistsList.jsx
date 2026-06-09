import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import "../Modals/Modal.css";

export default function HairStylistsList({
  hairStyleId,
  styleObj = null,
  isModal = false,
  onClose = null,
}) {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStylists = async () => {
      const userId = hairStyleId || styleObj?.hairStyleId;

      if (!userId) {
        setError("Invalid hairstyle ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(
          `/stylists/hairstylists/${userId}`
        );

        const result = response.data;

        if (result.succeeded && Array.isArray(result.data)) {
          const stylistsWithExtras = result.data.map((stylist) => ({
            ...stylist,

            // fake distance
            distanceInKm:
              stylist.distanceInKm ?? (Math.random() * 15 + 1).toFixed(1),

            // ensure id exists for navigation
            stylistId: stylist.stylistId || stylist.id,
          }));

          setStylists(stylistsWithExtras);
        } else {
          setError(result.message || "No stylists found.");
        }
      } catch (err) {
        console.error("Error fetching stylists:", err);
        setError("Failed to load stylists.");
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, [hairStyleId, styleObj]);

  // Navigate to booking page
  const handleBooking = (stylist) => {
    navigate(`/booking?stylistId=${stylist.stylistId}`);

    // close modal after navigation
    if (onClose) {
      onClose();
    }
  };

  // ---------- MODAL MODE ----------
  if (isModal) {
    if (!styleObj) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-box large">
          <h2>Stylists for: {styleObj.styleName}</h2>

          {loading && <p>Loading stylists...</p>}

          {error && <p className="error-text">{error}</p>}

          <div className="stylists-grid">
            {!loading &&
              !error &&
              stylists.map((s, index) => {
                // Average rating
                const averageRating =
                  s.ratings && s.ratings.length > 0
                    ? (
                        s.ratings.reduce((sum, r) => sum + (r.score || 0), 0) /
                        s.ratings.length
                      ).toFixed(1)
                    : "No ratings";

                return (
                  <div className="stylist-card" key={s.stylistId || index}>
                    <img
                      src={s.photoUrl || "/default.jpg"}
                      alt={s.companyName}
                      className="stylist-img"
                    />

                    <h3>{s.companyName}</h3>

                    <p>
                      <strong>Town:</strong> {s.town}
                    </p>

                    <p>
                      <strong>Experience:</strong> {s.experience} years
                    </p>

                    <p>
                      <strong>Rating:</strong> ⭐ {averageRating}
                    </p>

                    <div className="stylist-distance">
                      <i className="fas fa-map-marker-alt"></i>

                      <span>{s.distanceInKm} km away</span>
                    </div>

                    {/* BOOK BUTTON */}
                    <button
                      className="book-stylist-btn"
                      onClick={() => handleBooking(s)}
                    >
                      Book {s.companyName}
                    </button>
                  </div>
                );
              })}
          </div>

          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // ---------- STANDALONE MODE ----------

  if (loading) {
    return <p>Loading stylists...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="stylists-container">
      <h2>Stylists for this Hairstyle</h2>

      {stylists.length === 0 ? (
        <p>No stylists available for this hairstyle.</p>
      ) : (
        <ul className="stylist-list">
          {stylists.map((stylist, index) => (
            <li key={stylist.stylistId || index}>
              <strong>{stylist.companyName}</strong>
              <br />
              Town: {stylist.town}
              <br />
              Experience: {stylist.experience} years
              <br />
              Distance: {stylist.distanceInKm} km away
              <br />
              <br />
              <button
                className="book-stylist-btn"
                onClick={() => handleBooking(stylist)}
              >
                Book {stylist.companyName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



// import HairStylistsList from "./HairStylistsList";

// export default function ViewStylistsModal({ isOpen, onClose, style }) {
//   if (!isOpen) return null;

//   return (
//     <HairStylistsList
//       isModal={true}
//       onClose={onClose}
//       styleObj={style}
//     />
//   );
// }
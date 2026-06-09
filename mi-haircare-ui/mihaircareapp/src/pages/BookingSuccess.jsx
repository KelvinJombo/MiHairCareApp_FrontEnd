import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./CSS/ThankYou.css";

const BookingSuccess = () => {
  const location = useLocation();

  const { stylistName, date, timeSlot } = location.state || {};

  return (
    <div className="thank-you-page">
      <h1>🎉 Booking Confirmed!</h1>

      <p>Your appointment has been booked successfully.</p>

      <div className="booking-summary">
        <p>
          <strong>Stylist:</strong> {stylistName || "Your Selected Stylist"}
        </p>

        <p>
          <strong>Date:</strong> {date || "-"}
        </p>

        <p>
          <strong>Time:</strong> {timeSlot || "-"}
        </p>
      </div>

      <Link to="/hairstyles" className="btn-primary">
        Browse More Hairstyles
      </Link>
    </div>
  );
};

export default BookingSuccess;

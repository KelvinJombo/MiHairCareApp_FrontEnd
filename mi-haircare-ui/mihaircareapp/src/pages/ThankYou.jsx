// src/pages/ThankYou.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./CSS/ThankYou.css";

const ThankYou = () => {
  const location = useLocation();
  const { name, total } = location.state || {};

  return (
    <div className="thank-you-page">
      <h1>🎉 Thank You, {name || "Customer"}!</h1>
      <p>Your order has been successfully placed.</p>
      <h3>Total Paid: ₦{(total || 0).toLocaleString()}</h3>
      <Link to="/care-products" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
};

export default ThankYou;

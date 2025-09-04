import React from "react";
import "./Requests.css";

export const Requests = () => {
  return (
    <div className="requests">
      <h1>Request for Other Products</h1>
      <p>Stay Updated By E-mails When We Get New Arrivals</p>
      <div>
        <input type="email" placeholder="Your contact E-mail Id" />
        <button>Request</button>
      </div>
    </div>
  );
};

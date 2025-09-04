import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../assets/images/care_products/arrowicon.png";

export const Breadcrum = (props) => {
  const { product } = props;
  return (
    <div className="breadcrum">
      HOME <img src={arrow_icon} alt="" /> CARE PRODUCTS{" "}
      <img src={arrow_icon} alt="" /> {product.category}{" "}
      <img src={arrow_icon} alt="" /> {product.Name}
    </div>
  );
};

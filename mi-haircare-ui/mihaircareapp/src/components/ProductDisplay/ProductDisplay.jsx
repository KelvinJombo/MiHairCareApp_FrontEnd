import React from "react";
import "./ProductDisplay.css";
import star_icon from "../assets/images/twitting.png";
import star_dull_icon from "../assets/images/twitter.avif";

export const ProductDisplay = (props) => {
  const { product } = props;
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-image-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-image">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-old">${product.old_price}</div>
          <div className="productdisplay-right-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          Each product description will be rendered here according to product description from database
        </div>
        <div className="productdisplay-right-availability">
          <p>Available or Sold Out</p>
        </div>
        <button>ADD TO CART</button>         
      </div>
    </div>
  );
};

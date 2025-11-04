import React from "react";
import "./ProductDisplay.css"; 
 

export const ProductDisplay = (props) => {
  const { product } = props;
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-image-list">
          <img src={product.imageUrl} alt="" />
          <img src={product.imageUrl} alt="" />
          <img src={product.imageUrl} alt="" />
          <img src={product.imageUrl} alt="" />
        </div>
        <div className="productdisplay-image">
          <img className="productdisplay-main-img" src={product.imageUrl} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
      <h1>{product.productName}</h1>
<p className="productdisplay-brand">Brand: {product.brand}</p>
<div className="productdisplay-right-prices">
  <div className="productdisplay-right-new">₦{product.price}</div>
</div>
<p className="productdisplay-right-description">
  {product.description || "No description available."}
</p>
<p className="productdisplay-right-stock">
  {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
</p>
<button>Add to Cart 🛒</button>

      </div>
    </div>
  );
};

// src/components/ProductCard/ProductCard.jsx
import React, { useContext } from "react";
import CartContext from "../../Context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // normalize input from API (support both camelCase and PascalCase)
  const getField = (obj, ...names) => names.reduce((v, n) => v ?? obj?.[n], undefined);

  const normalized = {
    id: getField(product, "id", "Id", "haircareProductId", "HaircareProductId", "productId"),
    productName: getField(product, "productName", "ProductName", "name"),
    brandName: getField(product, "brandName", "BrandName", "brand"),
    price: getField(product, "price", "Price"),
    imageUrl: getField(product, "imageUrl", "ImageUrl", "image"),
    stockQuantity: getField(product, "stockQuantity", "StockQuantity"),
  };

  const handleAddToCart = () => {
    if (!normalized.id) {
      console.error("Cannot add product without id", product);
      alert("This product cannot be added to cart (missing id).");
      return;
    }

    addToCart({
      Id: normalized.id,
      ProductName: normalized.productName,
      Price: normalized.price,
      ImageUrl: normalized.imageUrl,
      StockQuantity: normalized.stockQuantity,
    });
  };

  return (
    <div className="product-card">
      <img src={normalized.imageUrl || "/placeholder.png"} alt={normalized.productName} />
      <h3>{normalized.productName}</h3>
      <p>Brand: {normalized.brandName}</p>
      <p>Price: ₦{normalized.price ?? "N/A"}</p>
      <button onClick={handleAddToCart} disabled={!normalized.id || (normalized.stockQuantity === 0)}>
        Add to Cart 🛒
      </button>
    </div>
  );
};

export default ProductCard;

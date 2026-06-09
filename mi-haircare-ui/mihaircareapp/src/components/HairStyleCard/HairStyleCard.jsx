import React from "react";
import "../../pages/CSS/StylesCategory.css";

export default function HairstyleCard({ style, onSelect }) {
  const image = style.photos?.[0]?.url || "/placeholder.jpg";

  return (
    <div className="hairstyle-card" onClick={() => onSelect(style)}>
      <img src={image} alt={style.styleName} className="hairstyle-image" />

      <div className="hairstyle-info">
        <h3>{style.styleName}</h3>
        <p className="price">₦{style.priceTag?.toLocaleString()}</p>

        {style.promotionalOffer && (
          <span className="promo-badge">Promo Offer</span>
        )}
      </div>
    </div>
  );
}

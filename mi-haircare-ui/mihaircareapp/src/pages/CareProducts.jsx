import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import StylistProductsContext from "../Context/StylistProductsContext";
import "./CSS/CareProducts.css";
import BannerImage from "../components/assets/images/care_products/HairCareSign.jpg";
import { useNavigate } from "react-router-dom";

const CareProducts = () => {
  const navigate = useNavigate();
  const { collections_data } = useContext(StylistProductsContext);
  const { category } = useParams();

  if (category) {
    const filtered = collections_data.filter((item) => item.category === category);
    return (
      <div className="care-page">
        <button
          className="admin-button"
          onClick={() => navigate("/admin/haircare")}
        >
          Admin Dashboard
        </button>

        {/* Banner */}
        <section className="banner">
          <div className="banner-content">
            <h1>Explore Our Hair Care Products</h1>
            <p>Growth, Treatment, and Styling solutions tailored for you.</p>
          </div>
          <div className="banner-image">
            <img src={BannerImage} alt="Hair Care Products" />
          </div>
        </section>

        <h2>{category.toUpperCase()} Products</h2>
        <div className="products-grid">
          {filtered.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
              <span>${product.new_price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="care-page">
      <button
        className="admin-button"
        onClick={() => navigate("/admin/haircare")}
      >
        Admin Dashboard
      </button>

      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          <h1>Discover Our Hair Care Range</h1>
          <p>From nourishing growth oils to styling essentials — we’ve got you covered.</p>
        </div>
        <div className="banner-image">
          <img src={BannerImage} alt="Hair Care Products" />
        </div>
      </section>

      <div className="care-products-links">
        <h2>Select a Care Product Category</h2>
        <div className="category-links">
          <Link to="/care-products/growth" className="care-category-card">
            Growth
          </Link>
          <Link to="/care-products/treatment" className="care-category-card">
            Treatment
          </Link>
          <Link to="/care-products/styling" className="care-category-card">
            Styling
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CareProducts;

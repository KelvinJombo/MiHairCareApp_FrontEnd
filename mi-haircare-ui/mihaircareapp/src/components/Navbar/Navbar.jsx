import React, { useState } from "react";
import "./Navbar.css";
import logo from "../assets/images/care_products/HairCareLogo.jpg";
import cart_icon from "../assets/images/cart.jpeg";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [menu, setMenu] = useState("shop");

  return (
    <div className="navbar">
      <div className="nav-left">
        <div className="nav-logo">
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img src={logo} alt="Logo" />
            <p>MI HAIR CARE</p>
          </Link>
        </div>
        <ul className="nav-menu">
          <li onClick={() => setMenu("careProducts")}>
            <Link style={{ textDecoration: "none" }} to="/care-products">
              Care Products
            </Link>
            {menu === "careProducts" && <hr />}
          </li>
          <li onClick={() => setMenu("gadgets")}>
            <Link style={{ textDecoration: "none" }} to="/gadgets">
              Gadgets & Accessories
            </Link>
            {menu === "gadgets" && <hr />}
          </li>
          <li onClick={() => setMenu("extensions")}>
            <Link style={{ textDecoration: "none" }} to="/extensions">
              Hair Extensions
            </Link>
            {menu === "extensions" && <hr />}
          </li>
          <li onClick={() => setMenu("hairstyles")}>
            <Link style={{ textDecoration: "none" }} to="/hairstyles">
              Hair Styles
            </Link>
            {menu === "hairstyles" && <hr />}
          </li>
        </ul>
      </div>
      <div className="nav-login-cart">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/cart" className="cart-icon-wrapper">
          <img src={cart_icon} alt="" />
          <div className="nav-cart-count">0</div>
        </Link>
      </div>
    </div>
  );
};

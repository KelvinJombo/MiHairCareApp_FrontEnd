import React, { useState, useContext } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./Navbar.css";
import logo from "../assets/images/care_products/HairCareLogo.jpg";
import cart_icon from "../assets/images/cart.jpeg";
import { Link } from "react-router-dom";
import CartContext from "../../Context/CartContext";

export const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { cart } = useContext(CartContext);
  const { user, logout } = useAuth();

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="navbar">
      {/* LEFT SIDE */}
      <div className="nav-left">
        <div className="nav-logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" />

            <div className="logo-text">MI HAIR CARE</div>
          </Link>
        </div>

        <ul className="nav-menu">
          <li onClick={() => setMenu("careProducts")}>
            <Link to="/care-products">Care Products</Link>
            {menu === "careProducts" && <hr />}
          </li>

          <li onClick={() => setMenu("gadgets")}>
            <Link to="/gadgets" className="two-line-menu">
              <span>Gadgets &</span>
              <span>Accessories</span>
            </Link>

            {menu === "gadgets" && <hr />}
          </li>

          <li onClick={() => setMenu("extensions")}>
            <Link to="/extensions">Hair Extensions</Link>
            {menu === "extensions" && <hr />}
          </li>

          <li onClick={() => setMenu("hairstyles")}>
            <Link to="/hairstyles">Hair Styles</Link>
            {menu === "hairstyles" && <hr />}
          </li>
          <li onClick={() => setMenu("feeds")}>
            <Link to="/feeds">Feeds</Link>
            {menu === "feeds" && <hr />}
          </li>
        </ul>
      </div>

      <div className="nav-login-cart">
        {user ? (
          <>
            <span className="nav-user-text">
              Hello, {user.firstName || user.email}
            </span>

            <button onClick={logout} className="logout-btn">
              Logout
            </button>

            <Link to="/cart" className="cart-icon-wrapper">
              {itemCount > 0 && (
                <span className="nav-cart-count">{itemCount}</span>
              )}
              <img src={cart_icon} alt="Cart Icon" className="cart-icon" />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/signup" className="signup-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

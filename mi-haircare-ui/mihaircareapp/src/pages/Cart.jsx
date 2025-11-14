// src/pages/Cart.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../Context/CartContext";
import "../pages/CSS/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, removeItem, clearCart } = useContext(CartContext);

  if (loading) return <div className="cart-loading">Loading your cart...</div>;

  const totalAmount = cart.totalAmount ?? cart.items.reduce((s, i) => s + (i.totalPrice || 0), 0);

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart 🛒</h2>

      {!cart || !cart.items?.length ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate("/care-products")} className="btn-primary">
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          {cart.items.map((item) => (
            <div className="cart-item" key={item.productId || item.Id || item.HaircareProductId}>
              <img src={item.imageUrl || item.ImageUrl || "/placeholder.png"} alt={item.productName || item.ProductName} />
              <div className="cart-details">
                <h3>{item.productName || item.ProductName}</h3>
                <p>Price: ₦{item.unitPrice}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: ₦{item.totalPrice}</p>

                <button className="btn-remove" onClick={() => removeItem(item.productId || item.Id || item.HaircareProductId)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <h3>Total: ₦{totalAmount}</h3>
            <button className="btn-checkout" onClick={() => navigate("/checkout")} disabled={!cart.items.length}>
              Checkout
            </button>

            <button className="btn-clear" onClick={clearCart} disabled={!cart.items.length}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

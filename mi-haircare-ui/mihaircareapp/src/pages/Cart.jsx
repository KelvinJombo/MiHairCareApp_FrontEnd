// src/pages/Cart.jsx
import React, { useContext, useEffect } from "react";
import CartContext from "../Context/CartContext";
import "../pages/CSS/Cart.css";

const Cart = () => {
  const {
    cart,
    loading,
    removeItem,
    clearCart,
    checkoutCart,
    fetchCart,
  } = useContext(CartContext);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return <div className="cart-loading">Loading your cart...</div>;
  }

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart 🛒</h2>

      {!cart || !cart.items?.length ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <a href="/care-products" className="btn-primary">
            Go Shopping
          </a>
        </div>
      ) : (
        <div className="cart-container">
          {cart.items.map((item) => (
            <div className="cart-item" key={item.productId}>
              <img
                src={item.imageUrl || "/placeholder.png"}
                alt={item.productName}
              />
              <div className="cart-details">
                <h3>{item.productName}</h3>
                <p>Price: ₦{item.unitPrice}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: ₦{item.totalPrice}</p>

                <button
                  className="btn-remove"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <h3>
              Total: ₦
              {cart.totalAmount ||
                cart.items.reduce(
                  (sum, item) => sum + item.totalPrice,
                  0
                )}
            </h3>

            <button
              className="btn-checkout"
              onClick={checkoutCart}
              disabled={!cart.items.length}
            >
              Checkout
            </button>

            <button
              className="btn-clear"
              onClick={clearCart}
              disabled={!cart.items.length}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

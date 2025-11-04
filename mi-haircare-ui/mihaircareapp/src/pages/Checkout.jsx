// src/pages/Checkout.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../Context/CartContext";
import "./CSS/Checkout.css";

const Checkout = () => {
  const { cart, loading, checkoutCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: "card",
  });

  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) {
      alert("Your cart is empty!");
      return;
    }

    setProcessing(true);
    try {
      // Send checkout request using CartContext function
      await checkoutCart({
        ...form,
        cartItems: cart.items,
      });

      // Navigate to Thank You page on success
      navigate("/thank-you", {
        state: { name: form.fullName, total: cart.totalAmount },
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong during checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-container">
        {/* 🧾 Left Side: Customer Info */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Billing Details</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              name="address"
              placeholder="Enter your delivery address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="card">Pay with Card</option>
              <option value="stripe">Pay with Stripe</option>
              <option value="delivery">Pay on Delivery</option>
            </select>
          </div>

          <button
            type="submit"
            className="checkout-btn"
            disabled={processing || !cart?.items?.length}
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </button>
        </form>

        {/* 💰 Right Side: Cart Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {!cart?.items?.length ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="summary-list">
                {cart.items.map((item) => (
                  <li key={item.productId} className="summary-item">
                    <img
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.productName}
                      className="summary-img"
                    />
                    <div>
                      <p className="summary-name">{item.productName}</p>
                      <p className="summary-price">
                        ₦{item.unitPrice.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="summary-total">
                <p>Total:</p>
                <h3>
                  ₦
                  {(
                    cart.totalAmount ||
                    cart.items.reduce(
                      (sum, item) => sum + item.totalPrice,
                      0
                    )
                  ).toLocaleString()}
                </h3>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

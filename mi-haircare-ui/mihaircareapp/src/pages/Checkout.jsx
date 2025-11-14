// src/pages/Checkout.jsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../Context/CartContext";
import apiClient from "../api/client";
import "./CSS/Checkout.css";

const stripePromise = loadStripe("pk_test_51PaarAJYC15LLJQsywJu7aMTftQfnIQ6oy5mbPIW2sSNeQcI8zZrxeJApcvhPHhzMp6hJv8dk9hxYS1ph2I2IyMi00j8rwaOA1");

const CheckoutForm = () => {
  const { cart, loading, checkoutCart } = useContext(CartContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: "card",
  });

  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) {
      alert("Your cart is empty!");
      return;
    }
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // 🧮 Calculate total amount
      const totalAmount =
        cart.totalAmount ||
        cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

      // 📨 Create PaymentIntent using your apiClient
      const response = await apiClient.post("/payment/create-intent", {
        amount: totalAmount,
        currency: "GBP",
        customerEmail: form.email,
      });

      const { clientSecret } = response.data;
      if (!clientSecret) throw new Error("Client secret not returned from backend");

      // 💳 Confirm payment on client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: form.fullName,
            email: form.email,
          },
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        alert(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        console.log("✅ Payment successful!");
        alert("Payment successful!");

        // Proceed to backend checkout logic
        await checkoutCart({
          ...form,
          cartItems: cart.items,
        });

        navigate("/thank-you", {
          state: { name: form.fullName, total: totalAmount },
        });
      }
    } catch (error) {
      console.error("❌ Checkout failed:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Billing Details</h2>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
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
          <option value="delivery">Pay on Delivery</option>
        </select>
      </div>

      {form.paymentMethod === "card" && (
        <div className="form-group">
          <label>Card Details</label>
          <div className="card-element-container">
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>
        </div>
      )}

      <button type="submit" disabled={processing || !cart?.items?.length}>
        {processing ? "Processing..." : "Confirm & Pay"}
      </button>
    </form>
  );
};

const Checkout = () => (
  <div className="checkout-page">
    <h1>Checkout</h1>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>
);

export default Checkout;

// src/pages/Checkout.jsx
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../Context/CartContext";
import apiClient from "../api/client";
import "./CSS/Checkout.css";

// CRA environment variable (yarn CRA), set in .env: REACT_APP_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) {
      alert("Your cart is empty!");
      return;
    }
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Calculate total amount in *major units* (your cart likely uses major currency units)
      const totalMajor =
        cart.totalAmount ??
        cart.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

      // Convert to minor units (pence) — Stripe expects integer in minor units
      const amountInMinorUnits = Math.round(totalMajor * 100);

      // Create PaymentIntent on backend (backend should return clientSecret and paymentIntentId)
      const response = await apiClient.post("/payment/create-intent", {
        amount: amountInMinorUnits, // integer (pence)
        currency: "gbp",
        customer: {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
      });

      const { clientSecret, paymentIntentId } = response.data || {};
      if (!clientSecret || !paymentIntentId)
        throw new Error(
          "Client secret or paymentIntentId not returned from backend"
        );

      // Confirm payment on client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            address: { line1: form.address },
          },
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        alert(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        console.log("✅ Payment successful!");

        // Notify backend to finalize checkout (pass paymentIntentId so backend can verify or link)
        await checkoutCart({
          paymentIntentId,
          customer: { ...form },
          cartItems: cart.items,
          amount: amountInMinorUnits,
        });

        navigate("/thank-you", {
          state: { name: form.fullName, total: totalMajor },
        });
      } else {
        console.warn("Unhandled payment state:", result.paymentIntent);
        alert("Payment not completed. Please check and try again.");
      }
    } catch (error) {
      console.error("❌ Checkout failed:", error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
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

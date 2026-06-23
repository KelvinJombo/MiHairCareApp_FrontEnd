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
import { useAuth } from "../Context/AuthContext";

// CRA environment variable (yarn CRA), set in .env: REACT_APP_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const { cart, loading, checkoutCart } = useContext(CartContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
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

    if (!user?.userId) {
      alert("User not logged in. Please login again.");
      navigate("/login");
      return;
    }

    setProcessing(true);

    try {
      const totalMajor =
        cart.totalAmount ??
        cart.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

      if (form.paymentMethod === "delivery") {
        const checkoutResult = await checkoutCart({
          paymentIntentId: null,
          paymentMethod: "delivery",
          shippingAddress: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          postalCode: form.postalCode,
        });

        if (checkoutResult) {
          navigate("/thank-you", {
            state: { name: form.fullName, total: totalMajor },
          });
        }
        return;
      }

      if (!stripe || !elements) {
        alert("Payment system is not ready yet. Please try again.");
        return;
      }

      // Convert to minor units for Stripe
      const amountInMinorUnits = Math.round(totalMajor * 100);

      const response = await apiClient.post("/payment/create-intent", {
        amount: amountInMinorUnits,
        currency: "NGN",
        customer: {
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
      });

      const data = response.data;

      if (!data?.succeeded) {
        throw new Error(data?.message || "Unable to initialize payment.");
      }

      const clientSecret = data?.data?.clientSecret;
      const paymentIntentId = data?.data?.paymentIntentId;
      if (!clientSecret || !paymentIntentId) {
        throw new Error(
          "Client secret or paymentIntentId not returned from backend"
        );
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card details are not ready yet. Please try again.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
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

        const checkoutResult = await checkoutCart({
          paymentIntentId,
          paymentMethod: "card",
          shippingAddress: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          postalCode: form.postalCode,
        });

        if (checkoutResult) {
          navigate("/thank-you", {
            state: { name: form.fullName, total: totalMajor },
          });
        }
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
        <label>City</label>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>State</label>
        <input
          type="text"
          name="state"
          value={form.state}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Postal Code</label>
        <input
          type="text"
          name="postalCode"
          value={form.postalCode}
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

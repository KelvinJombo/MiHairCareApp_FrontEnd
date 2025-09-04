import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import BannerImage from "../assets/images/woman_booking.avif"; 
import "./BookingPage.css"; 

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// ✅ Checkout Form
const CheckoutForm = ({ bookingDetails, goBack }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !amount) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://your-backend.com/api/payment/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bookingDetails,
            amount,
            currency: "usd",
          }),
        }
      );

      const { clientSecret } = await response.json();

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (error) {
        setMessage(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("✅ Payment successful! Booking confirmed.");
      }
    } catch (err) {
      setMessage("❌ Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePayment} className="checkout-form">
      <h2>Complete Your Booking</h2>
      <p>
        Appointment Date: <b>{bookingDetails.date.toDateString()}</b>
      </p>

      <div className="payment-options">
        <label>
          <input
            type="radio"
            name="paymentType"
            value="deposit"
            onChange={() => setAmount(5000)}
          />
          Pay Deposit ($50)
        </label>
        <label>
          <input
            type="radio"
            name="paymentType"
            value="full"
            onChange={() => setAmount(10000)}
          />
          Pay Full Amount ($100)
        </label>
      </div>

      <CardElement className="card-element" />

      <div className="form-actions">
        <button type="button" onClick={goBack} className="back-btn">
          ← Back
        </button>
        <button type="submit" disabled={!stripe || loading} className="pay-btn">
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {message && <p className="payment-message">{message}</p>}
    </form>
  );
};

// ✅ Booking Page
export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [step, setStep] = useState(1);

  const handleBooking = (date) => {
    setSelectedDate(date);
    setStep(2);
  };

  const bookingDetails = {
    stylistId: "123",
    date: selectedDate,
  };

  return (
    <div className="booking-page">
      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          <h1>Book Your Appointment</h1>
          <p>Select your preferred date and secure your spot today.</p>
          <div className="banner-images">
            <img src={BannerImage} alt="Booking Banner" />
          </div>
        </div>
      </section>

      {/* Booking Content */}
      <div className="booking-container">
        {step === 1 && (
          <div className="calendar-wrapper">
            <Calendar
              onClickDay={(date) => handleBooking(date)}
              tileDisabled={({ date }) => date < new Date()}
            />
          </div>
        )}

        {step === 2 && (
          <Elements stripe={stripePromise}>
            <CheckoutForm bookingDetails={bookingDetails} goBack={() => setStep(1)} />
          </Elements>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import apiClient from "../../api/client";
import BannerImage from "../assets/images/woman_booking.avif";
import "./BookingPage.css";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

/* CHECKOUT FORM */
const CheckoutForm = ({ bookingDetails, goBack, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !amount) {
      setMessage("Please select an amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post("/payment/create-intent", {
        amount,
        currency: "ngn",

        customer: {
          name: "Booking Customer",
          email: "customer@email.com",
          phone: "08000000000",
          address: "Nigeria",
        },
      });

      console.log("PAYMENT RESPONSE:", response.data);

      const data = response.data;

      if (!data.succeeded) {
        throw new Error(data.message);
      }

      const clientSecret = data.data.clientSecret;

      if (!clientSecret) {
        throw new Error("No client secret returned.");
      }

      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,

          billing_details: {
            name: bookingDetails.stylistName || "Customer",
            email: "customer@email.com",
            phone: "08000000000",
          },
        },
      });

      if (result.error) {
        setMessage(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful! Finalizing booking...");

        try {
          const bookingRes = await apiClient.post("/Bookings/createBooking", {
            stylistId: bookingDetails.stylistId,
            hairStyleId: bookingDetails.hairStyleId,
            appointmentDate: bookingDetails.date,
            timeSlot: bookingDetails.timeSlot,
            paymentCompleted: true,
            paymentType,
            amountPaid: amount / 100,
            referred: false,
            referrerUserId: null,
          });

          if (bookingRes.data?.succeeded) {
            setMessage("🎉 Booking confirmed!");

            onSuccess({
              stylistName: bookingDetails.stylistName,
              date: bookingDetails.dateString,
              timeSlot: bookingDetails.timeSlot,
            });
          } else {
            setMessage("Payment succeeded but booking creation failed.");
          }
        } catch (error) {
          console.error("BOOKING ERROR:", error);

          if (error.response) {
            console.error("STATUS:", error.response.status);
            console.error("DATA:", error.response.data);
          }

          throw error;
        }
      }
    } catch (error) {
      console.error("PAYMENT ERROR:", error);

      if (error.response) {
        console.error("BACKEND RESPONSE:", error.response.data);
        console.error("STATUS:", error.response.status);
      }

      setMessage(
        error?.response?.data?.message || error.message || "Payment failed."
      );
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePayment} className="checkout-form">
      <h2>Complete Booking</h2>

      <p>
        Date: <b>{bookingDetails.date.toDateString()}</b>
      </p>
      <p>
        Time Slot: <b>{bookingDetails.timeSlot}</b>
      </p>

      <p>
        Hairstyle:
        <b> {bookingDetails.hairstyleName}</b>
      </p>

      <p>
        Total Cost:
        <b>₦{bookingDetails.amount?.toLocaleString()}</b>
      </p>

      <div className="payment-options">
        <label
          className={`payment-card ${
            paymentType === "Deposit" ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="paymentType"
            checked={paymentType === "Deposit"}
            onChange={() => {
              setAmount(bookingDetails.depositAmount * 100);
              setPaymentType("Deposit");
            }}
          />

          <div className="payment-card-content">
            <h4>Pay Deposit</h4>
            <p>Reserve your appointment now</p>

            <span className="price">
              ₦{bookingDetails.depositAmount?.toLocaleString()}
            </span>
          </div>
        </label>

        <label
          className={`payment-card ${paymentType === "Full" ? "selected" : ""}`}
        >
          <input
            type="radio"
            name="paymentType"
            checked={paymentType === "Full"}
            onChange={() => {
              setAmount(bookingDetails.amount * 100);
              setPaymentType("Full");
            }}
          />

          <div className="payment-card-content">
            <h4>Pay Full Amount</h4>
            <p>Complete payment immediately</p>

            <span className="price">
              ₦{bookingDetails.amount?.toLocaleString()}
            </span>
          </div>
        </label>
      </div>
      {amount && (
        <div className="amount-summary">
          <span>Amount To Pay</span>

          <strong>₦{(amount / 100).toLocaleString()}</strong>
        </div>
      )}
      <CardElement className="card-element" />

      <div className="form-actions">
        <button type="button" className="back-btn" onClick={goBack}>
          ← Back
        </button>
        <button type="submit" className="pay-btn" disabled={!stripe || loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {message && <p className="payment-message">{message}</p>}
    </form>
  );
};

/* BOOKING PAGE */
export default function BookingPage() {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);

  const stylistId = query.get("stylistId");
  const hairStyleId = query.get("hairStyleId");

  const [stylist, setStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [step, setStep] = useState(1);
  const [hairStyle, setHairStyle] = useState(null);

  /* Load selected stylist details */
  useEffect(() => {
    if (!stylistId) return;

    const fetchStylist = async () => {
      try {
        const res = await apiClient.get(`/Users/${stylistId}`);

        console.log("STYLIST RESPONSE:", res.data);

        if (res.data?.succeeded) {
          setStylist(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStylist();
  }, [stylistId]);

  /* Load availability from backend */
  const loadAvailability = async (stylistId, date) => {
    try {
      const res = await apiClient.get(`/Users/userId/availability`, {
        params: {
          date: date.toISOString(),
        },
      });

      const data = res.data;

      // If backend returns slots
      if (data?.availableSlots && data.availableSlots.length > 0) {
        setTimeSlots(data.availableSlots);
      }

      // TEMPORARY FALLBACK
      else {
        setTimeSlots([
          "09:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "01:00 PM",
          "02:00 PM",
          "03:00 PM",
        ]);
      }
    } catch (error) {
      console.error("Failed to load availability", error);

      // TEMPORARY FALLBACK
      setTimeSlots([
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
      ]);
    }
  };

  /* When date is selected */
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedSlot("");

    await loadAvailability(stylistId, date);

    setStep(2);
  };

  const bookingDetails = {
    stylistId,
    hairStyleId,
    stylistName: stylist?.companyName?.trim(),
    hairstyleName: hairStyle?.styleName,
    amount: hairStyle?.priceTag ?? 0,
    depositAmount: (hairStyle?.priceTag ?? 0) / 2,
    date: selectedDate,
    dateString: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
    timeSlot: selectedSlot,
  };

  useEffect(() => {
    console.log("hairStyleId:", hairStyleId);

    if (!hairStyleId) return;

    const fetchHairStyle = async () => {
      try {
        console.log("Calling hairstyle endpoint");

        const res = await apiClient.get(`/HairStyles/${hairStyleId}`);

        console.log("HAIRSTYLE RESPONSE:", res.data);

        if (res.data?.succeeded) {
          setHairStyle(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchHairStyle();
  }, [hairStyleId]);

  return (
    <div className="booking-page">
      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          {/* LEFT TEXT AREA */}
          <div className="banner-text">
            <h1>Book Appointment with {stylist?.companyName || "Stylist"}</h1>

            <p>
              Select your preferred appointment date and available time slot.
            </p>
          </div>

          {/* RIGHT IMAGE AREA */}
          <div className="banner-image">
            <img src={BannerImage} alt="Booking Banner" />
          </div>
        </div>
      </section>

      <div className="booking-container">
        {/* STEP 1 — Select Date */}
        {step === 1 && (
          <>
            <h2>Select a Date</h2>
            <Calendar
              onClickDay={handleDateSelect}
              tileDisabled={({ date }) => date < new Date()}
            />
          </>
        )}

        {/* STEP 2 — Select Time Slot */}
        {step === 2 && (
          <>
            <h2>Choose Time Slot</h2>

            {timeSlots.length === 0 ? (
              <div className="no-slots">
                No available time slots for this date.
              </div>
            ) : (
              <div className="slots-grid">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    className={`slot-btn ${
                      selectedSlot === t ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSlot(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button className="back-btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="pay-btn"
                disabled={!selectedSlot}
                onClick={() => setStep(3)}
              >
                Continue to Payment
              </button>
            </div>
          </>
        )}

        {/* STEP 3 — Payment */}
        {step === 3 && (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              bookingDetails={bookingDetails}
              goBack={() => setStep(2)}
              onSuccess={(bookingInfo) =>
                navigate("/booking-success", {
                  state: bookingInfo,
                })
              }
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";
import apiClient from "../api/client";
import getServerMessage from "../utils/getServerMessage";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export async function processStripePayment({
  totalAmount,
  currentUser,
  form,
  elements,
}) {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error("Stripe failed to initialize.");
  }

  if (!elements) {
    throw new Error("Stripe Elements is not ready.");
  }

  if (!currentUser?.userId) {
    throw new Error("User is not logged in.");
  }

  const response = await apiClient.post("/api/payment/create-intent", {
    amount: totalAmount * 100,
    currency: "NGN",
    customerId: currentUser.userId,
    customer: {
      name: form.userName,
      email: form.email,
      phone: form.phone,
      address: form.address,
    },
  });

  const data = response?.data;
  if (!data?.succeeded) {
    throw new Error(
      getServerMessage(response) || data?.message || "Payment failed.",
    );
  }

  const clientSecret = data?.data?.clientSecret;
  if (!clientSecret) {
    throw new Error("Client secret not returned from backend.");
  }

  const cardElement = elements.getElement(CardElement);
  if (!cardElement) {
    throw new Error("Card details are not ready yet.");
  }

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: form.userName,
        email: form.email,
        phone: form.phone,
      },
    },
  });

  if (result.error) {
    throw result.error;
  }

  if (result.paymentIntent?.status === "succeeded") {
    return result.paymentIntent;
  }

  throw new Error("Payment was not completed.");
}

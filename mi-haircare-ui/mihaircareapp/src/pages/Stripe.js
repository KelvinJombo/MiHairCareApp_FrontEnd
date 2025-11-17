const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const response = await apiClient.post("/api/payment/create-intent", {
  amount: totalAmount,
  currency: "GBP",
  customer: {
    name: form.userName,
    email: form.email,
    phone: form.phone,
    address: form.address,
  }
});
const data = await response.json();
const clientSecret = data.clientSecret;

const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),
    billing_details: { name: "Kelvin Okonkwo" }
  }
});

if (result.paymentIntent.status === "succeeded") {
  console.log("✅ Payment successful!");
}

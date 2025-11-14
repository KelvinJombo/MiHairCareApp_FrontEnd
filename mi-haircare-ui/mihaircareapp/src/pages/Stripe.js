const stripe = await loadStripe("pk_test_XXXXXXX");

const response = await fetch("/api/payment/create-intent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 5000,
    currency: "GBP",
    customerEmail: "kelvin@example.com"
  })
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

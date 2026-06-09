const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

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

const data = response.data;

if (!data.succeeded) {
  alert(data.message);
  return;
}

const clientSecret = data.data.clientSecret;

const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),

    billing_details: {
      name: form.userName,
      email: form.email,
      phone: form.phone,
    },
  },
});

if (result.error) {
  alert(result.error.message);
  return;
}

if (result.paymentIntent.status === "succeeded") {
  alert("✅ Payment successful!");
}

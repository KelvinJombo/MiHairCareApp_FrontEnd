import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = ({ userType = "User" }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "https://localhost:7261/api";

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      alert("Please enter your registered email.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      // 👇 Adjust endpoint dynamically based on account type
      const endpoint =
        userType.toLowerCase() === "stylist"
          ? `${apiBaseUrl}/Authentication/ForgotPasswordStylist`
          : `${apiBaseUrl}/Authentication/ForgotPassword`;

      const response = await axios.post(endpoint, { email });

      setStatus(`✅ ${response.data?.message || "Password reset link sent successfully!"}`);
    } catch (error) {
      console.error("Forgot password error:", error);
      setStatus(
        `❌ ${error.response?.data?.message || "Unable to send password reset link. Try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password ({userType})
        </h2>

        <label className="block mb-2 text-gray-700">Email Address</label>
        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleForgotPassword}
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {status && (
          <p
            className={`mt-4 text-center ${
              status.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

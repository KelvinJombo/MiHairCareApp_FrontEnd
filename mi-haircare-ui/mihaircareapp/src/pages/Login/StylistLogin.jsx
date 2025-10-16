import React, { useState } from "react";
import "../CSS/LoginSignUp.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../src/firebaseConfig";
import axios from "axios";

const StylistLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "https://localhost:7261/api";

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const payload = { email, password };
      const response = await axios.post(`${apiBaseUrl}/Stylists/Login`, payload);
      setStatus(`✅ Welcome back, ${response.data?.data?.stylistName || "Stylist"}!`);
      localStorage.setItem("stylistToken", response.data?.data?.token);
    } catch (error) {
      console.error("Stylist login error:", error);
      setStatus(`❌ ${error.response?.data?.message || "Login failed."}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post(`${apiBaseUrl}/Stylists/GoogleLogin`, { idToken });
      setStatus(`✅ Welcome ${user.displayName || "Stylist"}!`);
      localStorage.setItem("stylistToken", response.data?.data?.token);
    } catch (error) {
      console.error("Google login failed:", error);
      setStatus(`❌ ${error.message || "Google Sign-In failed."}`);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Stylist Login</h1>

        <div className="loginsignup-fields">
          <input
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <p
          className="forgot-password"
          onClick={() => (window.location.href = "/stylist-forgot-password")}
        >
          Forgot Password?
        </p>

        <button onClick={handleLogin}>Login</button>

        <div className="or-divider">
          <hr /> <span>OR</span> <hr />
        </div>

        <button className="google-signin-btn" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="google-logo"
          />
          Login with Google
        </button>

        {status && <p className="google-status">{status}</p>}

        <p className="loginsignup-login">
          Don’t have a stylist account?{" "}
          <span onClick={() => (window.location.href = "/stylist-signup")}>
            Sign Up as Stylist
          </span>
        </p>
      </div>
    </div>
  );
};

export default StylistLogin;

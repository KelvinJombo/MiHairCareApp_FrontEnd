import React, { useState } from "react";
import "../CSS/LoginSignUp.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../src/firebaseConfig";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "https://localhost:7261/api";

  // ✅ Normal Login
  const handleLogin = async () => {
    if (!email || !password) {
      setStatus("❌ Please enter your email and password.");
      return;
    }

    try {
      const payload = { email, password };
      const response = await axios.post(
        `${apiBaseUrl}/Authentication/Login`,
        payload
      );

      const data = response.data?.data;
      if (!data?.token) {
        setStatus("❌ Login failed. Please check your credentials.");
        return;
      }

      // Store login info locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);

      setStatus(`✅ Welcome back, ${data.email}!`);

      // Redirect after a short delay
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (error) {
      console.error("Login error:", error);
      setStatus(
        `❌ ${
          error.response?.data?.message ||
          "Unable to log in. Please try again."
        }`
      );
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        `${apiBaseUrl}/Authentication/login-with-google`,
        { idToken }
      );

      const data = response.data?.data;
      if (!data?.token) {
        setStatus("❌ Google login failed. Please try again.");
        return;
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);

      setStatus(`✅ Welcome back, ${data.email}!`);

      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (error) {
      console.error("Google login failed:", error);
      setStatus(`❌ ${error.message || "Google Sign-In failed."}`);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Login</h1>

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
          onClick={() => (window.location.href = "/forgot-password")}
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
          Sign in with Google
        </button>

        {status && <p className="google-status">{status}</p>}

        <p className="loginsignup-login">
          Don’t have an account?{" "}
          <span onClick={() => (window.location.href = "/signup")}>
            Sign Up
          </span>
        </p>

        <p className="loginsignup-login stylist-link">
          Are you a stylist?{" "}
          <span onClick={() => (window.location.href = "/stylist-login")}>
            Login as Stylist
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

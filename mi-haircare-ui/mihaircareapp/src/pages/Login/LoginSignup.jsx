import React, { useState } from "react";
import "../CSS/LoginSignUp.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../src/firebaseConfig";
import { registerWithGoogle } from "../../../src/api/GoogleAuthService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  // ✅ State for normal signup
  const [firstName, setFirstName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "https://localhost:7261/api";

  // ✅ Normal registration
  const handleRegister = async () => {
    // Validation before sending
    if (
      !firstName.trim() ||
      !userName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      alert(
        "Please fill all required fields (Name, Username, Email, Password)."
      );
      return;
    }

    try {
      const payload = {
        firstName,
        userName,
        email,
        password,
        phoneNumber,
      };

      const response = await axios.post(
        `${apiBaseUrl}/Authentication/Register`,
        payload
      );
      setStatus(
        `✅ Registration successful for ${
          response.data?.data?.userName || userName
        }`
      );
    } catch (error) {
      console.error("Registration error:", error);
      setStatus(
        `❌ ${error.response?.data?.message || "Registration failed."}`
      );
    }
  };
  const navigate = useNavigate();
  // ✅ Handle Google Sign-In + Backend Registration
  const handleGoogleSignIn = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter your phone number before signing in with Google.");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await registerWithGoogle(idToken, phoneNumber);
      setStatus(`✅ Welcome ${user.displayName}! Registration successful.`);
    } catch (error) {
      console.error("Error during Google registration:", error);
      setStatus(`❌ ${error.message || "Google Sign-In failed."}`);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Sign Up</h1>

        {/* Normal signup fields */}
        <div className="loginsignup-fields">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
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
          <input
            type="text"
            placeholder="Phone Number (optional)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>I agree to the Terms and Conditions of use and Privacy Policy</p>
        </div>

        {/* ✅ Normal Registration */}
        <button onClick={handleRegister}>Continue</button>

        <div className="or-divider">
          <hr /> <span>OR</span> <hr />
        </div>

        {/* ✅ Google Sign-In Button */}
        <button className="google-signin-btn" onClick={handleGoogleSignIn}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="google-logo"
          />
          Sign in with Google
        </button>

        {status && <p className="google-status">{status}</p>}

        <p className="loginsignup-login">
          Already Have An Account?{" "}
          <span onClick={() => navigate("/login")}>Login Here</span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;

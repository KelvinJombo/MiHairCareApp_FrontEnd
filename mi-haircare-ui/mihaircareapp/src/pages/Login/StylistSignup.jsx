import React, { useState } from "react";
import "../CSS/LoginSignUp.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../src/firebaseConfig";
import axios from "axios";

const StylistSignup = () => {
  const [stylistName, setStylistName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [town, setTown] = useState("");
  const [street, setStreet] = useState("");
  const [homeService, setHomeService] = useState(false);
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "https://localhost:7261/api";

  const handleRegister = async () => {
    if (!stylistName.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        stylistName,
        companyName,
        email,
        town,
        street,
        homeService,
        password,
        phoneNumber,
      };

      const response = await axios.post(`${apiBaseUrl}/Stylists/Register`, payload);
      setStatus(`✅ Stylist ${stylistName} registered successfully!`);
    } catch (error) {
      console.error("Stylist registration error:", error);
      setStatus(`❌ ${error.response?.data?.message || "Registration failed."}`);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post(`${apiBaseUrl}/Stylists/GoogleRegister`, {
        idToken,
        phoneNumber,
      });

      setStatus(`✅ Stylist ${user.displayName} registered successfully via Google!`);
    } catch (error) {
      console.error("Google registration error:", error);
      setStatus(`❌ ${error.message || "Google Registration failed."}`);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Stylist Sign Up</h1>

        <div className="loginsignup-fields">
          <input
            type="text"
            placeholder="Stylist Name"
            value={stylistName}
            onChange={(e) => setStylistName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Town"
            value={town}
            onChange={(e) => setTown(e.target.value)}
          />
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={homeService}
              onChange={(e) => setHomeService(e.target.checked)}
            />
            Offers Home Service
          </label>
        </div>

        <button onClick={handleRegister}>Sign Up</button>

        <div className="or-divider">
          <hr /> <span>OR</span> <hr />
        </div>

        <button className="google-signin-btn" onClick={handleGoogleSignUp}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="google-logo"
          />
          Sign up with Google
        </button>

        {status && <p className="google-status">{status}</p>}

        <p className="loginsignup-login">
          Already a stylist?{" "}
          <span onClick={() => (window.location.href = "/stylist-login")}>
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default StylistSignup;

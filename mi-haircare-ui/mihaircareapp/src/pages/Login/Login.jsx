import React, { useState, useEffect } from "react";
import "../CSS/LoginSignUp.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../src/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const { user, login, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // Redirect after login
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async () => {
    if (!email || !password) {
      setStatus("❌ Please enter your email and password.");
      return;
    }

    const result = await login(email, password);
    setStatus(result.message);
    if (result.success) navigate(from, { replace: true });
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const loginResult = await loginWithGoogle(idToken);
      setStatus(loginResult.message);
      if (loginResult.success) navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      setStatus("❌ Google login failed.");
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    setStatus(result.message);
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        {user ? (
          <>
            <h1>You Are Logged In</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            {status && <p className="google-status">{status}</p>}
          </>
        ) : (
          <>
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

            {status && <p className="google-status">{status}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

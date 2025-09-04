import React from "react";
import "../CSS/LoginSignUp.css";

const LoginSignup = () => {
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Sign Up</h1>
        <div className="loginsignup-fields">
          <input type="text" placeholder="Your Name" />
          <input type="text" placeholder="Email Address" />
          <input type="text" placeholder="Password" />
        </div>
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>
            I Agree to Terms and Conditions of use and Privacy
            Policy
          </p>
        </div>
        <button>Continue</button>
        <p className="loginsignup-login">
          Already Have An Account? <span>Login Here</span>
        </p>       
      </div>
    </div>
  );
};

export default LoginSignup;

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user info
  const [token, setToken] = useState(null); // Stores JWT token
  const [loading, setLoading] = useState(true); // Optional for showing spinner

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "https://localhost:7261/api";

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("firstName");

    if (storedToken && storedUser && storedUserId) {
      setToken(storedToken);
      setUser({
        email: storedUser,
        userId: storedUserId,
        role: storedRole,
        firstName: storedName,
      });
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/Authentication/Login`, {
        email,
        password,
      });

      const data = response.data?.data;
      if (!data?.token) throw new Error("Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", "user");
      localStorage.setItem("firstName", data.firstName);

      setToken(data.token);

      setUser({
        email: data.email,
        userId: data.userId,
        role: "user",
        firstName: data.firstName,
      });

      return { success: true, message: `Welcome, ${data.firstName}` };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to log in. Please try again.",
      };
    }
  };
  // Google login
  const loginWithGoogle = async (idToken) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/Authentication/login-with-google`,
        { idToken }
      );

      const data = response.data?.data;
      if (!data?.token) throw new Error("Google login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("role", "user");

      setToken(data.token);
      setUser({
        email: data.email,
        userId: data.userId,
        role: "user",
        firstName: data.firstName,
      });

      return { success: true, message: `Welcome back, ${data.firstName}` };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, message: "Google login failed." };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const logoutUrl =
        user?.role === "stylist"
          ? `${apiBaseUrl}/Stylists/logout`
          : `${apiBaseUrl}/Authentication/logout`;

      await axios.post(
        logoutUrl,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("role");

      setToken(null);
      setUser(null);

      return { success: true, message: "Logout successful" };
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false, message: "Unable to logout" };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

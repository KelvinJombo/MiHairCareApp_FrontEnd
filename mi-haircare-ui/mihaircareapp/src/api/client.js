// src/api/client.js
import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE_URL || // CRA / Vite env
  process.env.VITE_API_BASE_URL || // Vite
  "https://localhost:7261/api";

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// attach token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

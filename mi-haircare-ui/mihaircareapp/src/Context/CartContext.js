// src/Context/CartContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "https://localhost:7261/api";
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const axiosInstance = axios.create({
    baseURL: `${apiBaseUrl}/Cart`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // ✅ View Cart
  const fetchCart = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/${userId}`);
      setCart(response.data?.data || response.data);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      setCart({ items: [] });
      return;
    }

    let fetched = false;

    const fetchOnce = async () => {
      if (!fetched) {
        fetched = true;
        await fetchCart();
      }
    };

    fetchOnce();
  }, [token, userId]);

  // ✅ Add to Cart
  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // assuming you stored this at login

    if (!token) {
      alert("Please log in to add to cart.");
      window.location.href = "/login";
      return;
    }

    try {
      const dto = {
        productId: product.id || product.productId,
        quantity: 1,
      };

      console.log("Adding to cart with dto:", dto, "and userId:", userId);

      const response = await axiosInstance.post(`/add?userId=${userId}`, dto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data?.data || response.data);
      alert(`${product.name || product.productName} added to cart!`);
    } catch (err) {
      console.error("❌ Add to cart error:", err);
      alert("Failed to add item to cart.");
    }
  };

  // ✅ Remove Item
  const removeItem = async (productId) => {
    if (!userId) return alert("Please log in first.");

    try {
      await axiosInstance.delete(`/${userId}/item/${productId}`);
      await fetchCart();
      alert("Item removed successfully!");
    } catch (err) {
      console.error("❌ Remove item error:", err);
    }
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    if (!userId) return alert("Please log in first.");
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      await axiosInstance.delete(`/${userId}`);
      setCart({ items: [] });
      alert("Cart cleared!");
    } catch (err) {
      console.error("❌ Clear cart error:", err);
    }
  };

  // ✅ Checkout Cart
  const checkoutCart = async () => {
    if (!userId) return alert("Please log in first.");

    try {
      const response = await axiosInstance.post(`/checkout?userId=${userId}`);
      alert(response.data?.message || "Checkout successful!");
      setCart({ items: [] });
    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert(err.response?.data?.message || "Checkout failed.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeItem,
        clearCart,
        checkoutCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

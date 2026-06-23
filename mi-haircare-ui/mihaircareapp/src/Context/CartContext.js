// src/Context/CartContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import apiClient from "../api/client";
import getServerMessage from "../utils/getServerMessage";
import showToast from "../utils/toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // NOTE: get userId fresh in functions to avoid stale values
  const getUserId = () => localStorage.getItem("userId");

  const fetchCart = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setCart({ items: [] });
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/Cart/${userId}`);
      setCart(response.data?.data || response.data || { items: [] });
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const mapToAddToCartDto = (product) => ({
    Id:
      product.Id ||
      product.id ||
      product.HaircareProductId ||
      product.haircareProductId ||
      product.productId,
    Quantity: product.quantity || 1,
  });

  const addToCart = async (product) => {
    const userId = getUserId();
    if (!userId) {
      showToast.info("Please log in to add to cart.");
      window.location.href = "/login";
      return;
    }

    const dto = mapToAddToCartDto(product);

    if (!dto.Id) {
      showToast.error("Invalid product ID");
      console.error("❌ DTO missing Id:", dto, "Product:", product);
      return;
    }

    try {
      const response = await apiClient.post(`/Cart/add?userId=${userId}`, dto);
      setCart(response.data?.data || response.data || { items: [] });

      window.location.href = "/cart";
    } catch (err) {
      console.error("❌ Add to cart error:", err);
      showToast.error(
        getServerMessage(err) ||
          "Failed to add item to cart. Please try again.",
      );
    }
  };

  const removeItem = async (productId) => {
    const userId = getUserId();
    if (!userId) {
      showToast.info("Please log in to manage cart.");
      return;
    }
    try {
      await apiClient.delete(`/Cart/${userId}/item/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error("❌ Remove item error:", err);
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) {
      showToast.info("Please log in to manage cart.");
      return;
    }
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      await apiClient.delete(`/Cart/${userId}`);
      setCart({ items: [] });
    } catch (err) {
      console.error("❌ Clear cart error:", err);
    }
  };

  const checkoutCart = async (checkoutData) => {
    const userId = getUserId();

    if (!userId) {
      showToast.info("Please log in to checkout.");
      return false;
    }

    try {
      const response = await apiClient.post("/Cart/checkout", checkoutData);

      showToast.success(
        getServerMessage(response) ||
          response.data?.message ||
          "Checkout successful",
      );
      setCart({ items: [] });
      return true;
    } catch (err) {
      console.error("❌ Checkout error:", err);
      showToast.error(getServerMessage(err) || "Checkout failed.");
      return false;
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

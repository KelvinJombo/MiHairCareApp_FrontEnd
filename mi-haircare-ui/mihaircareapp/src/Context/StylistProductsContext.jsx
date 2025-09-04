import React, { createContext, useState } from "react";
import collections_data from "../components/assets/collections_data";

const StylistProductsContext = createContext();

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < collections_data.length + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const StylistProductsContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  return (
    <StylistProductsContext.Provider
      value={{ collections_data, cartItems, addToCart, removeFromCart }}
    >
      {children}
    </StylistProductsContext.Provider>
  );
};

export { StylistProductsContextProvider };
export default StylistProductsContext;

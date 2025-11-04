// src/Context/StylistProductsContext.js
import React, { createContext } from "react";
import collections_data from "../components/assets/collections_data";

const StylistProductsContext = createContext();

const StylistProductsContextProvider = ({ children }) => {
  return (
    <StylistProductsContext.Provider value={{ collections_data }}>
      {children}
    </StylistProductsContext.Provider>
  );
};

export { StylistProductsContextProvider };
export default StylistProductsContext;

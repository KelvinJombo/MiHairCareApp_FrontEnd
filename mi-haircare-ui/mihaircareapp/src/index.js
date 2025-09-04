import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./index.css";
import { StylistProductsContextProvider } from "./Context/StylistProductsContext";
import 'leaflet/dist/leaflet.css';
//import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
//import 'leaflet-defaulticon-compatibility';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StylistProductsContextProvider>
    <App />
  </StylistProductsContextProvider>
);

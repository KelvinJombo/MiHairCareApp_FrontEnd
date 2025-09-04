import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import Growth from "./Growth";
import Treatment from "./Treatment";
import Styling from "./Styling";
import Cart from "./Cart";
import LoginSignup from "./Login/LoginSignup";
import { Gadgets } from "./Gadgets";
import { Extensions } from "./Extensions";
import StylistProductsCategory from "./CareProducts";
import { Product } from "./Product";
import BookingPage from "../components/BookingPage/BookingPage";
import HairstyleStylists from './HairstyleStylists';

// New Hairstyle pages
import Hairstyles from "./HairStyles";
import African from "../components/African/African_HairStyles";
import American from "../components/American/American_HairStyles";
import Asian from "../components/Asian/Asian_HairStyles";
import European from "../components/European/European_HairStyles";
import Haircutz from "../components/Haircutz/HairCutz";

// African subcategories
import Braids from "../components/African/Braids";
import Weaves from "../components/African/Weaves";
import Dreadlocks from "../components/African/DreadLocs";

function App() {
  return (
    <Suspense fallback="loading">
      <Router>
        <Navbar />
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Care Products */}
          <Route path="/care-products" element={<StylistProductsCategory />} />
          <Route path="/care-products/growth" element={<Growth />} />
          <Route path="/care-products/treatment" element={<Treatment />} />
          <Route path="/care-products/styling" element={<Styling />} />

          {/* Gadgets & Extensions */}
          <Route path="/gadgets" element={<Gadgets />} />
          <Route path="/extensions" element={<Extensions />} />

          {/* Cart & Auth */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />

          {/* Products */}
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>

          {/* Hairstyles Main */}
          <Route path="/hairstyles" element={<Hairstyles />} />

        {/* African Hairstyles & Subcategories */}
        <Route path="/hairstyles/african" element={<African />} />
        <Route path="/hairstyles/african/braids" element={<Braids />} />
        <Route path="/hairstyles/african/weaves" element={<Weaves />} />
        <Route path="/hairstyles/african/dreadlocks" element={<Dreadlocks />} />

        {/* Other regions */}
        <Route path="/hairstyles/european" element={<European />} />
        <Route path="/hairstyles/asian" element={<Asian />} />
        <Route path="/hairstyles/american" element={<American />} />
        <Route path="/hairstyles/haircutz" element={<Haircutz />} />

        <Route path="/booking" element={<BookingPage />} />
        <Route path="/hairstyles/:hairStyleId" element={<HairstyleStylists />} />

        </Routes>
        <Footer />
      </Router>
    </Suspense>
  );
}

export default App;

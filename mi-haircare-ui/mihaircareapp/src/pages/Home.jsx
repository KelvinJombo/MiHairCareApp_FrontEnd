import React from "react";
import "./CSS/Home.css";
import { Hero } from "../components/Hero/Hero";
import { PopularDemand } from "../components/PopularDemand/PopularDemand";
import { Offers } from "../components/Offers/Offers";
import { NewCollections } from "../components/NewCollections/NewCollections";
import { Requests } from "../components/Requests/Requests";

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularDemand />
      <Offers />
      <NewCollections />
      <Requests />
    </div>
  );
};

export default Home;

import React from "react";
import "./PopularDemand.css";
import product_data from "../assets/product_data";
import {Item} from "../Item/Item";

export const PopularDemand = () => {
  return (
    <div className="popular">
      <h1>HOT SALES HAIRCARE PRODUCTS</h1>
      <hr />
      <div className="popular-item">
        {product_data.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

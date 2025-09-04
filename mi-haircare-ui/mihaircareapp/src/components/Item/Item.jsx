import React from "react";
import "./Item.css";
import { Link } from 'react-router-dom';


export const Item = (props) => {
  return (
    <div className="item">
      <Link to={`/product/${props.Id}`}>
        <img src={props.image} alt="" />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices"></div>
      <div className="item-prices-new">#{props.new_price}</div>
      <div className="item-price-old">#{props.old_prices}</div>
    </div>
  );
};

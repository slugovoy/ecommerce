import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getBraintreeClientToken } from "./apiCore";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import DropIn from "braintree-web-drop-in-react";

const Checkout = ({ products }) => {
  const [data, setData] = useState({
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
  console.log(token);
  console.log(userId);

  const getToken = async(userId, token) => {
    try {

      const response = await getBraintreeClientToken(userId, token);
      console.log(response);
      setData({ ...data, clientToken: response.clientToken });
    } catch(error) {
      setData({ ...data, error: error });

    }
  };
 console.log(data);
  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Sign In to checkout</button>
      </Link>
    );
  };

  console.log(data.clientToken);
  // console.log(products.length);

  const showDropIn = () => {
    return (

    <div onBlur={() => setData({...data, error: ""})}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <DropIn
            options={{
              authorization: data.clientToken
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button className="btn btn-success">Pay</button>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
    )
  };

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showCheckout()}
    </div>
  );
};

export default Checkout;

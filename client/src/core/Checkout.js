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
  // console.log(token);
  // console.log(userId);

  const getToken = async (userId, token) => {
    try {
      const response = await getBraintreeClientToken(userId, token);
      console.log(response);
      setData({ ...data, clientToken: response.clientToken });
    } catch (error) {
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

  // console.log(data.clientToken);
  // console.log(products.length);

  const buy = () => {
    // send the nonce to your servers
    // nonce = data.instance.requestPaymentMethod()
    let nonce;
    let getNonce = data.instance.requestPaymentMethod().then((data) => {
      console.log(data);
      nonce = data.nonce;
      // once you have nonce(card type, card number) send nonce as "PaymentMethodNonce"
      // and total to be charged

      console.log("nonce and total: ", nonce, getTotal(products))

    })
    .catch(error => {
      console.log("dropin error", error);
      setData({...data, error: error.message});
    })
  };

  const showDropIn = () => {
    return (
      <div onBlur={() => setData({ ...data, error: "" })}>
        {data.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{
                authorization: data.clientToken,
              }}
              onInstance={(instance) => (data.instance = instance)}
            />
            <button onClick={buy} className="btn btn-success">
              Pay
            </button>
          </div>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    );
  };

  const showError = (error) => (
    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
      {error}
    </div>
  )

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;

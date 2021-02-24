import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import Checkout from "./Checkout";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);
  useEffect(() => {
    setItems(getCart());
  }, [run]);
  // console.log(items);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your Cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((product, index) => (
          <Card
            product={product}
            key={index}
            showAddToCartBtn={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };

  const noItemsMassage = () => (
    <h2>
      Your cart is empty.
      <br />
      <Link to="/shop">Continue shopping</Link>
    </h2>
  );

  return (
    <Layout
      title="Shopping Cart Page"
      description="Manage your cart items here..."
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMassage()}
        </div>
        <div className="col-6">
          <h2>Your cart summary</h2>
          <hr/>
          <Checkout products={items}/>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;

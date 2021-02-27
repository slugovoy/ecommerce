import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { listOrders, getStatusValues } from "./apiAdmin";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };
  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showOrderLength = () => {
    if (orders.length > 0) {
      return (
        <h2 className="text-danger display-3">
          Total number of orders: {orders.length}
        </h2>
      );
    } else {
      return <h3 className="text-danger">No orders available</h3>;
    }
  };

  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly />
    </div>
  );

  const handleStatusChange = (event, orderId) => {
      console.log("update status")
  }

  const showStatus = (order) => (
    <div className="form-group">
      <h4 className="mark mb-4">Status: {order.status}</h4>
      <select
        className="form-control"
        onChange={(event) => handleStatusChange(event, order._id)}
      >
        <option>Update Status</option>
        {statusValues.map((status, index) => (
          <option value={status} key={index}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Layout
      title="Orders"
      description={`Good day ${user.name}, manage all the orders here...`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showOrderLength()}

          {orders.map((order, orderIndex) => {
            return (
              <div
                className="mt-5"
                key={orderIndex}
                style={{ borderBottom: "5px solid indigo" }}
              >
                <h3 className="mb-5">
                  <span className="bg-info">Order ID: {order._id}</span>
                </h3>

                <ul className="list-group mb-2">
                  <li className="list-group-item">
                    Order Status: {showStatus(order)}
                  </li>
                  <li className="list-group-item">
                    Transaction ID: {order.transaction_id}
                  </li>
                  <li className="list-group-item">
                    Order total amount: ${order.amount}
                  </li>
                  <li className="list-group-item">
                    Ordered By: {order.user.name}
                  </li>
                  <li className="list-group-item">
                    Order placed: {moment(order.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">
                    Delivery Address: {order.address}
                  </li>
                </ul>

                <h4 className="mt-4 mb-4 font-italic">
                  Total number of products in the order: {order.products.length}
                </h4>

                {order.products.map((product, productIndex) => (
                  <div
                    className="mb-4"
                    key={productIndex}
                    style={{ padding: "20px", border: "1px solid indigo" }}
                  >
                    {showInput("Product name", product.name)}
                    {showInput("Product price", product.price)}
                    {showInput("Product total", product.count)}
                    {showInput("Product Id", product._id)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;

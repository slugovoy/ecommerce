import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  const removeProduct = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout
      title="Manage Products"
      description="Manage your products here..."
      className="container-fluid"
    >
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Total - {products.length} products</h2>
          <hr />
          <ul className="list-group">
            {products.map((product, index) => (
              <li
                className="list-group-item"
                key={index}
              >
                <div className="row d-flex justify-content-end align-items-center">
                  <div className="col-8">
                    <strong>{product.name}</strong>
                  </div>
                  <div className="col-2">
                    <Link to={`/admin/product/update/${product._id}`}>
                      <span className="badge badge-warning badge-pill">
                        Update
                      </span>
                    </Link>
                  </div>
                  <div className="col-2">
                    <span
                      onClick={() => removeProduct(product._id)}
                      className="badge badge-danger badge-pill"
                      style={{cursor: 'pointer'}}
                    >
                      Delete
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProduct;

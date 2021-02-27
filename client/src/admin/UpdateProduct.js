import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: "",
  });
  const { user, token } = isAuthenticated();
  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData(),
          redirectToProfile: false
        });
        initCategories();
      }
    });
  };
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    init(match.params.productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    updateProduct(match.params.productId, user._id, token, formData).then((data) => {
      console.log(data)
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          photo: "",
          price: "",
          quantity: "",
          loading: false,
          error: false,
          redirectToProfile: true,
          createdProduct: data.name,
        });
      }
    });
  };

  const newPostForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4 className="">Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image/*"
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          value={name}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          value={description}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("price")}
          type="number"
          value={price}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category")} className="form-control">
          <option>Please select a category</option>
          {categories &&
            categories.map((cat, index) => (
              <option value={cat._id} key={index}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          onChange={handleChange("quantity")}
          type="number"
          value={quantity}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select onChange={handleChange("shipping")} className="form-control">
          <option>Please select an option</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>
      <button className="btn btn-outline-primary">Update Product</button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h3>{`Product ${createdProduct} was ypdated!`}</h3>
    </div>
  );
  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h3>Loading...</h3>
      </div>
    );


    const redirectUser = () => {
      if(redirectToProfile) {
        if(!error) {
          return <Redirect to="/admin/products" />
        }
      }
    }

  return (
    <Layout
      title="Add a new product"
      description={`Good day ${user.name}, ready to add a new product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {error ? showError() : ""}
          {createdProduct ? showSuccess() : ""}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;

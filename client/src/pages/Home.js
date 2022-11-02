import React, { useState } from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import Cart from "../components/Cart";
import Snackbar from "../components/Snack";
const Home = () => {
  return (
    <div className="container">
      <Snackbar />
      <CategoryMenu />
      <ProductList />
      <Cart />
    </div>
  );
};

export default Home;

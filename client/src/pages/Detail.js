import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from "../assets/spinner.gif";

import { useStoreContext } from "../utils/GlobalState";
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from "../utils/actions";

import Cart from "../components/Cart";
import { idbPromise } from "../utils/helpers";
import Auth from "../utils/auth";

function Detail() {
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();
  // get token
  const loggedIn = Auth.loggedIn();
  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state;
  // addToCart function
  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
      // if were updating the auantity, use existing item data and increment purchaseQuantity value by one
      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 },
      });
      //if product isnt in the cart yet, add it to the current shopping cart in IndexedDB
      idbPromise("cart", "put", { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  // Remove function
  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id,
    });

    //upon removal from cart, delete the item from INdexedDB using the 'currentProduct._id' to locate what to remove
    idbPromise("cart", "delete", { ...currentProduct });
  };

  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    } else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
    }
    //get cache from idb
    else if (!loading) {
      idbPromise("products", "get").then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts,
        });
      });
    }
  }, [products, data, loading, dispatch, id]);

  return (
    <div className="detail-page">
      {currentProduct ? (
        <div className="container detail">
          <div className=" my-1 detail-left">
            <Link to="/">
              <p className="mini-title py-2">← Back to Products</p>
            </Link>
            <img
              className="detail-img"
              src={`/images/${currentProduct.image}`}
              alt={currentProduct.name}
            />
          </div>
          <div className="detail-right">
            <div>
              <h2 className="detail-title griffy">{currentProduct.name}</h2>
              <p className="description merriweather">
                {currentProduct.description}
              </p>
            </div>
            <div className="price">
              <p>
                {" "}
                <strong>Price: </strong>${currentProduct.price}{" "}
              </p>
            </div>

            {loggedIn ? (
              <>
                <button onClick={addToCart}>Add to Cart</button>
                <button
                  disabled={!cart.find((p) => p._id === currentProduct._id)}
                  onClick={removeFromCart}
                >
                  Remove from Cart
                </button>
              </>
            ) : (
              <p>You need to login to shop!</p>
            )}
          </div>
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </div>
  );
}

export default Detail;

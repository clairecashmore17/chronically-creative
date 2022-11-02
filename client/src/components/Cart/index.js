import React, { useEffect } from "react";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";
import "./style.css";
import { useStoreContext } from "../../utils/GlobalState";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT, QUERY_USER } from "../../utils/queries";
import { loadStripe } from "@stripe/stripe-js";
import { useLazyQuery, useQuery } from "@apollo/client";

//api test key for stripe checkout

const stripePromise = loadStripe(
  "pk_live_51LyHfdL3rxnL4bOiE7gWRxzFWXfSKDrm5FIH2hqMyOM7Q4BzjVkOXhoqESfyyFmvFC0HUmXcIuSVunSQMyCg3YTd00hdh3mfhs"
);
const Cart = () => {
  const { loading, data: userdata } = useQuery(QUERY_USER);
  const user = userdata?.user || {};

  //establish state variable and dispatch function to update the state
  const [state, dispatch] = useStoreContext();

  //hook for lazyQuery checkout so QUERY_CHECKOUT is only executed when we tell it to
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise("cart", "get");
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    }

    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  // second useEffect in order to watch for changes to our data in QUERY_CHECKOUT
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }
  function calculateTotal() {
    let sum = 0;
    state.cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  //submit checkout function
  function submitCheckout() {
    const productIds = [];
    //loop over the items saved in cart and add ids to productIds, fed to QUERY_CHECKOUTS
    state.cart.forEach((item) => {
      productIds.push(item._id);
    });

    getCheckout({
      variables: { products: productIds },
    });
  }

  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }
  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
          {state.cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="flex-row space-between">
            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Buy Me!</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;

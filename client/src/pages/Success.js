import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import Jumbotron from "../components/Jumbotron";
import { ADD_ORDER } from "../utils/mutations";
import { idbPromise } from "../utils/helpers";

function Success() {
  const [addOrder] = useMutation(ADD_ORDER);

  useEffect(() => {
    async function saveOrder() {
      const cart = await idbPromise("cart", "get");
      const products = cart.map((item) => item._id);

      //pass through the addORder mutation to put in database
      if (products.length) {
        const { data } = await addOrder({
          variables: {
            products,
          },
        });
        const productData = data.addOrder.products;

        productData.forEach((item) => {
          idbPromise("cart", "delete", item);
        });
      }
      //redirect to homepage after around 3 seconds
      setTimeout(() => {
        window.location.assign("/");
      }, 3000);
    }

    saveOrder();
  }, [addOrder]);

  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>
          Thank you for your purchase! We will get started on it right away!
        </h2>
        <h2>Bringing you back to the homepage...</h2>
      </Jumbotron>
    </div>
  );
}

export default Success;

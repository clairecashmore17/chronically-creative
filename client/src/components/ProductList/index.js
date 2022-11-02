import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";

import ProductItem from "../ProductItem";
import { useStoreContext } from "../../utils/GlobalState";
import { UPDATE_PRODUCTS } from "../../utils/actions";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif";

import { idbPromise } from "../../utils/helpers";
import "./index.css";

function ProductList() {
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      // lets tore it in the global state object
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });

      //but lets also take each product and save it to IndexedDB using the helper function
      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
    } else if (!loading) {
      //since we are offline, get all of the data from the 'products' store
      idbPromise("products", "get").then((products) => {
        //use retrieved data to set global state for offline browsing
        dispatch({
          type: "UPDATE_PRODUCTS",
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }
    console.log(
      state.products.filter(
        (product) => product.category._id === currentCategory
      )
    );
    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className=" product-list">
      <h2 className="product-title griffy">
        {" "}
        Your own crochet is a click away...
      </h2>
      {state.products.length ? (
        <div className="flex-row products">
          {filterProducts().map((product, index) => (
            <>
              {product != {} ? (
                <ProductItem
                  key={product._id + index.toString()}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                />
              ) : (
                <>
                  <h3 className="product-title">
                    You haven't added any products yet!
                  </h3>
                </>
              )}
            </>
          ))}
        </div>
      ) : (
        <h3 className="product-title">You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;

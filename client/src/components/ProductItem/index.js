import React from "react";
import { Link } from "react-router-dom";
import { idbPromise, pluralize } from "../../utils/helpers";
import { useStoreContext } from "../../utils/GlobalState";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import Auth from "../../utils/auth.js";
function ProductItem(item) {
  // define our state variable
  const [state, dispatch] = useStoreContext();
  const { cart } = state;
  const loggedIn = Auth.loggedIn();
  const addToCart = () => {
    // find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);

    // if there was a match, call UPDATE with a new purchase quantity
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 },
      });
      idbPromise("cart", "put", { ...item, purchaseQuantity: 1 });
    }
  };
  const { image, name, _id, price, quantity } = item;

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img className="prod-img" alt={name} src={`/images/${image}`} />
        <p className="mini-title abril">{name}</p>
      </Link>
      <div>
        {/* <div>
          {quantity} {pluralize("item", quantity)} in stock
        </div> */}
        <span>${price}</span>
      </div>
      {loggedIn ? (
        <button className="cart-btn" onClick={addToCart}>
          Add to cart
        </button>
      ) : (
        <button disabled={true} onClick={addToCart}>
          Login to purchase
        </button>
      )}
    </div>
  );
}

export default ProductItem;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { idbPromise, pluralize } from "../../utils/helpers";
import { useStoreContext } from "../../utils/GlobalState";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import Auth from "../../utils/auth.js";
import SignupForm from "../../pages/SignupForm";
import LoginForm from "../../pages/LoginForm";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Grow from "@mui/material/Grow";

function ProductItem(item) {
  // define our state variable
  const [state, dispatch] = useStoreContext();
  const [checked, setChecked] = useState(true);
  const { cart } = state;
  const loggedIn = Auth.loggedIn();
  const [showModal, setShowModal] = useState(false);
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
    <>
      <Grow in={checked}>
        <div className="card centered px-1 py-1">
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
              <AddShoppingCartIcon />
            </button>
          ) : (
            <button className="cart-btn" onClick={() => setShowModal(true)}>
              <AddShoppingCartIcon />
            </button>
          )}
        </div>
      </Grow>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">
                    <p className="login">Login</p>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">
                    <p className="login">Sign Up</p>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignupForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
}

export default ProductItem;

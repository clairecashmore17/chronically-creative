import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignupForm from "../../pages/SignupForm";
import LoginForm from "../../pages/LoginForm";
import { QUERY_USER } from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import "./index.css";
const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  // const [user, setUser] = useState("");
  const { loading, data } = useQuery(QUERY_USER);
  const user = data?.user || {};
  console.log(user);
  return (
    <>
      <Navbar className="nav-head">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <h1 className="web-title lobster">Chronically Creative</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              {/* if user is logged in show order history and logout */}
              {Auth.loggedIn() ? (
                <>
                  {user.admin ? (
                    <Nav.Link as={Link} to="/orders">
                      <p className="nav-items">Orders</p>
                    </Nav.Link>
                  ) : (
                    <Nav.Link as={Link} to="/orderHistory">
                      <p className="nav-items">See Your Orders</p>
                    </Nav.Link>
                  )}

                  {/* <Nav.Link as={Link} to="/profile">
                    <p className="nav-items">Account</p>
                  </Nav.Link> */}

                  <Nav.Link onClick={Auth.logout}>
                    <p className="nav-items logout">Logout</p>
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>
                  <p className="nav-items abril">Login/Sign Up</p>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
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
};

export default AppNavbar;

import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";

function OrderHistory() {
  const { data } = useQuery(QUERY_USER);
  let user;
  console.log("data is " + data);
  if (data) {
    user = data.user;
  }
  console.log(`user data is ${user}`);
  return (
    <>
      <div className="orders">
        <Link to="/">← Back to Products</Link>

        {user ? (
          <>
            <h2>
              Order History for {user.firstName} {user.lastName}
            </h2>
            <div className="container">
              {user.orders.map((order) => (
                <Card key={order._id}>
                  <h3 className="purchase-date">
                    Purchased on{" "}
                    {new Date(
                      parseInt(order.purchaseDate)
                    ).toLocaleDateString()}
                  </h3>
                  <Card.Body>
                    {order.products.map(
                      ({ _id, image, name, price }, index) => (
                        <Card key={index} className="order">
                          <Card.Body>
                            <Link to={`/products/${_id}`}>
                              <Card.Img
                                variant="top"
                                alt={name}
                                src={`/images/${image}`}
                              />
                              <Card.Text className="mini-title">
                                {name}
                              </Card.Text>
                            </Link>
                            <Card.Text>
                              <span>${price}</span>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      )
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default OrderHistory;

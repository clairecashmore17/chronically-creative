import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { QUERY_ORDERS } from "../utils/queries";
import Button from "react-bootstrap/Button";

function Orders() {
  const { data, loading } = useQuery(QUERY_ORDERS);
  const users = data?.users || {};

  console.log(users);
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="product-title">Orders you've recieved!</h1>
          {users.length != 0 ? (
            <>
              {users.map((user, index) => (
                <div key={user._id + index.toString()}>
                  <h3 className="title">Order for {user.username}</h3>
                  {user.orders.map((order, index) => (
                    <Card key={order._id + index.toString()}>
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
                        )}{" "}
                        {/* <Button onClick={}>Complete Order</Button> */}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

export default Orders;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import CustomNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/orders/sellerorders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <CustomNavbar />
      <Container fluid>
        <h2 className="my-4 text-center">Orders</h2>
        {orders.length === 0 ? (
          <h3 className="text-center">No orders available</h3>
        ) : (
          <Row className="justify-content-center">
            {orders.map((order) => (
              <Col key={order._id} md={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5>Order ID: {order._id}</h5>
                  </Card.Header>
                  <Card.Body>
                    <h6>Order Items:</h6>
                    {order.orderItems.map((item) => (
                      <Card key={item._id} className="mb-3">
                        <Card.Body>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>Qty: {item.qty}</Card.Text>
                          <Card.Img
                            variant="top"
                            src={item.image}
                            style={{ maxWidth: "100px" }}
                          />
                          <Card.Text>Price: ${item.price.toFixed(2)}</Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                    <h6 className="mt-3">Shipping Address:</h6>
                    <Card.Text>
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.postalCode},{" "}
                      {order.shippingAddress.country}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Orders;

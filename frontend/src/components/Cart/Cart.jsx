import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Row, Col, Modal, Form } from "react-bootstrap";
import CustomNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "./Cart.module.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [shippingAddressDetails, setShippingAddressDetails] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod] = useState("Cash on Delivery"); 

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCart(response.data.items);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/update",
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedCart = cart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleQuantityChange = (productId, delta) => {
    const item = cart.find((item) => item.product._id === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta); 
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderItems = cart.map((item) => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item.product._id,
      }));

      const shippingAddress = {
        address: shippingAddressDetails,
        city,
        postalCode,
        country,
      };

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems,
          shippingAddress,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Order completed successfully!");
      setCart([]); 
      setShowModal(false); 
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CustomNavbar />
      <Container className={styles.cartContainer} fluid>
        <Row className="d-flex justify-content-center align-items-center">
          <Col md={6}>
            <h1 className="text-center mb-3">Cart</h1>
            {cart.length === 0 ? (
              <h2 className="text-center">Your cart is empty.</h2>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item._id} className={styles.cartItem}>
                    <img src={item.image} alt={item.name} />
                    <div className={styles.cartItemDetails}>
                      <h5>{item.name}</h5>
                      <p>${item.price.toFixed(2)}</p>
                      <div className={styles.quantityControls}>
                        <Button
                          className={styles.increDecre}
                          onClick={() =>
                            handleQuantityChange(item.product._id, -1)
                          }
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          className={styles.increDecre}
                          onClick={() =>
                            handleQuantityChange(item.product._id, 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  className={styles.button}
                  onClick={() => setShowModal(true)}
                >
                  Proceed to Checkout
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formShippingAddress">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter shipping address"
                value={shippingAddressDetails}
                onChange={(e) => setShippingAddressDetails(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPostalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPaymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control type="text" value={paymentMethod} readOnly />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className={styles.button} onClick={() => setShowModal(false)}>
            Close
          </button>
          <button className={styles.button} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Cart;

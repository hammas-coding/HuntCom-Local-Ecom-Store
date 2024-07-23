import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Footer from "../Footer/Footer";
import CustomNavbar from "../Navbar/Navbar";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login First!");
    }
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CustomNavbar />
      <Container className={styles.productDetailsContainer}>
        <Row>
          <Col md={6} className={styles.productImageWrapper}>
            <Card.Img
              variant="top"
              src={product.image}
              className={styles.productImage}
            />
          </Col>
          <Col md={6}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h4>${product.price.toFixed(2)}</h4>
            <p>Stock: {product.stock}</p>
            <button onClick={addToCart} className={styles.button}>
              Add to Cart
            </button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetails;

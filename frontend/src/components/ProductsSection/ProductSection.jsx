import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import styles from "./ProductSection.module.css";

const ProductSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.slice(0, 6)); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container className={styles.productSection} fluid>
      <h2 className={styles.productTitle}>Products</h2>
      <p className={styles.productSubtitle}>
        Order it for you or for your beloved ones
      </p>
      <Row className={styles.productGrid}>
        {products.map((product) => (
          <Col
            key={product._id}
            md={4}
            lg={3}
            className="mb-4 d-flex justify-content-center"
          >
            <Card className={styles.productCard}>
              <Card.Img
                variant="top"
                src={product.image}
                className={styles.productImage}
              />
              <Card.Body>
                <Card.Title className={styles.productName}>
                  {product.name}
                </Card.Title>
                <Card.Text className={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductSection;

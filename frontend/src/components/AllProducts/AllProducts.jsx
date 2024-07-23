import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";
import CustomNavbar from "../Navbar/Navbar";
import styles from "./AllProducts.module.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOption, setSortOption] = useState("latest");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setShowFilterModal(false);
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "priceLowToHigh":
          return a.price - b.price;
        case "priceHighToLow":
          return b.price - a.price;
        case "latest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  return (
    <>
      <CustomNavbar />
      <Container fluid className={styles.allProductsContainer}>
        <h2 className={styles.productTitle}>All Products</h2>
        <Form className="mb-4">
          <Form.Group
            controlId="search"
            className="d-flex justify-content-evenly align-items-center"
          >
            <Form.Control
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: "80%" }}
            />
            <Button
              className={styles.button}
              onClick={() => setShowFilterModal(true)}
              type="button" 
            >
              Filter
            </Button>
          </Form.Group>
        </Form>
        <Row>
          {filteredProducts.map((product) => (
            <Col key={product._id} md={4} className="mb-4">
              <Card className={styles.productCard}>
                <Link
                  to={`/product/${product._id}`}
                  className={styles.productLink}
                >
                  <Card.Img
                    variant="top"
                    src={product.image}
                    className={styles.productImage}
                  />
                  <Card.Body>
                    <Card.Title className={styles.productName}>
                      {product.name}
                    </Card.Title>
                    <Card.Text className={styles.productDescription}>
                      {product.description}
                    </Card.Text>
                    <Card.Text className={styles.productPrice}>
                      ${product.price.toFixed(2)}
                    </Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="sortByPrice">
              <Form.Label>Sort By</Form.Label>
              <Form.Control
                as="select"
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="latest">Latest Products</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default AllProducts;

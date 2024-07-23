import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import styles from "./SellerAllProducts.module.css";
import CustomNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const SellerAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleShowForm = (mode, product = null) => {
    setModalMode(mode);
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setImage(product.image);
      setImagePreview(product.image);
      setCurrentProduct(product);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setStock("");
      setImage("");
      setImagePreview("");
      setCurrentProduct(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => setShowForm(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const imageUrl = await uploadImageToCloudinary(file);
    if (imageUrl) {
      setImage(imageUrl);
      setImagePreview(imageUrl); // Show image preview
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/dtys2qg58/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "ecom-store";

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const { data } = await axios.post(CLOUDINARY_URL, formData);
      return data.secure_url;
    } catch (error) {
      console.error(
        "Error uploading image to Cloudinary:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/products", {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
        image,
      });
      alert("Product added successfully!");
      fetchProducts();
      handleCloseForm();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const editProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/products/${currentProduct._id}`, {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
        image,
      });
      alert("Product updated successfully!");
      fetchProducts();
      handleCloseForm();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleSubmit = async (e) => {
    if (modalMode === "create") {
      await addProduct(e);
    } else if (modalMode === "edit") {
      await editProduct(e);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the list of products
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className={styles.container}>
        <button
          variant="primary"
          className={`mb-4 ${styles.button}`}
          onClick={() => handleShowForm("create")}
        >
          Add New Product
        </button>
        <Row>
          {products.length > 0 ? (
            products.map((product) => (
              <Col key={product._id} md={4} className="mb-4">
                <Card className={styles.card}>
                  <Card.Img
                    variant="top"
                    src={product.image}
                    className={styles.image}
                  />
                  <Card.Body className={styles.cardBody}>
                    <Card.Title className={styles.cardTitle}>
                      {product.name}
                    </Card.Title>
                    <Card.Text className={styles.cardText}>
                      {product.description}
                    </Card.Text>
                    <Card.Text className={styles.cardText}>
                      <strong>Price:</strong> ${product.price}
                    </Card.Text>
                    <Card.Text className={styles.cardText}>
                      <strong>Category:</strong> {product.category}
                    </Card.Text>
                    <Card.Text className={styles.cardText}>
                      <strong>Stock:</strong> {product.stock}
                    </Card.Text>
                    <div className={styles.buttonContainer}>
                      <button
                        variant="warning"
                        onClick={() => handleShowForm("edit", product)}
                        className={`${styles.button} me-2`}
                      >
                        Edit
                      </button>
                      <button
                        variant="danger"
                        onClick={() => handleDelete(product._id)}
                        className={`${styles.button}`}
                      >
                        Delete
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <h2 className="text-center mb-3">No products found</h2>
          )}
        </Row>
      </Container>
      <Footer />

      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "create" ? "Add Product" : "Edit Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "100%" }}
                  />
                </div>
              )}
            </Form.Group>
            <button variant="primary" type="submit" className={styles.button}>
              {modalMode === "create" ? "Add Product" : "Update Product"}
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SellerAllProduct;

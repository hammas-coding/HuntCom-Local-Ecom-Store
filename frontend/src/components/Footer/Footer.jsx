import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/email/send-email", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
          <Col>
            <h2 className={styles.footerTitle}>Stay Updated</h2>
            <Form className={styles.footerForm} onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formMessage">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </Form.Group>
              <button className={styles.button} type="submit">
                Send Message
              </button>
            </Form>
            <div className={styles.socialIcons}>
              <a
                href="https://www.facebook.com/hammas7rashid/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.linkedin.com/in/hammas-rashid/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/hammas_rashid/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

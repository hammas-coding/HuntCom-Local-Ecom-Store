import React from "react";
import CustomNavbar from "../Navbar/Navbar";
import Wallpaper from "../wallpaper/Wallpaper";
import Footer from "../Footer/Footer";
import { Container, Row, Col, Button } from "react-bootstrap";
import AboutImage from "../../assets/about.jpg"; 
import styles from "./About.module.css";

const About = () => {
  const aboutTitle = "About Us";
  const aboutContent =
    "Learn more about our store and the quality products we offer.";
  const aboutButton = "Read more";

  return (
    <>
      <CustomNavbar />
      <Wallpaper
        title={aboutTitle}
        content={aboutContent}
        button={aboutButton}
      />
      <Container fluid className={styles.aboutSection}>
        <Row className="align-items-center">
          <Col md={6} className={styles.aboutText}>
            <h2>About Our E-Commerce Store</h2>
            <p>
              Welcome to our e-commerce store, where you can find a wide variety
              of high-quality products. We pride ourselves on providing the best
              shopping experience for our customers. Our store offers a diverse
              range of items to meet all your needs and preferences. Shop with
              us and enjoy top-notch customer service and fast delivery.
            </p>
          </Col>
          <Col md={6}>
            <img
              src={AboutImage}
              alt="About Us"
              className={`img-fluid ${styles.aboutImage}`}
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default About;

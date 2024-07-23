import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "./Modals.module.css";

const LoginModal = ({
  show,
  handleClose,
  handleSignup,
  handleLoginAsSeller,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          isSeller: false,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (onLoginSuccess) onLoginSuccess();
        setEmail("");
        setPassword("");
        handleClose();
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleLogin}>
          {error && <div className={styles.error}>{error}</div>}
          <Form.Group controlId="formBasicEmail" className={styles.formGroup}>
            <Form.Label className={styles.label}>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            controlId="formBasicPassword"
            className={styles.formGroup}
          >
            <Form.Label className={styles.label}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </Form>
        <button onClick={handleSignup} className={styles.linkButton}>
          Sign Up
        </button>
        <button onClick={handleLoginAsSeller} className={styles.linkButton}>
          Login as Seller
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;

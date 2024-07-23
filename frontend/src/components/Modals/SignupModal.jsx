import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import styles from "./Modals.module.css";

const SignupModal = ({ show, handleClose, handleShowOtpModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          isSeller: false,
        }
      );
      if (response.status === 200) {
        setName("");
        setEmail("");
        setPassword("");
        handleClose();
        handleShowOtpModal(email);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("User with this email already exists");
      } else {
        setError("Error registering user. Please try again.");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className={styles.error}>{error}</p>}
        <Form onSubmit={handleSignup}>
          <Form.Group controlId="formName" className={styles.formGroup}>
            <Form.Label className={styles.label}>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
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
            Sign Up
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignupModal;

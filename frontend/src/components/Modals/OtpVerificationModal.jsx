import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import styles from "./Modals.module.css";

const OtpVerificationModal = ({ show, handleClose, email }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );
      if (response.status === 201) {
        setOtp("");
        handleClose();
        alert("Account Created!");
      }
    } catch (error) {
      setError("Invalid OTP or OTP expired. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verify OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className={styles.error}>{error}</p>}
        <Form onSubmit={handleVerifyOtp}>
          <Form.Group controlId="formOtp" className={styles.formGroup}>
            <Form.Label className={styles.label}>OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>

          <button type="submit" className={styles.button}>
            Verify
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OtpVerificationModal;

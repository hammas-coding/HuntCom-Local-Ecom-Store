import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa"; // Import the user icon from react-icons
import Logo from "../../assets/ecom-logo.png"; // Adjust the path as needed
import styles from "./Navbar.module.css";
import LoginModal from "../Modals/LoginModal";
import SignupModal from "../Modals/SignupModal";
import SellerLoginModal from "../Modals/SellerLoginModal";
import SellerSignupModal from "../Modals/SellerSignupModal";
import OtpVerificationModal from "../Modals/OtpVerificationModal";

const CustomNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSellerLoginModal, setShowSellerLoginModal] = useState(false);
  const [showSellerSignupModal, setShowSellerSignupModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (token) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLoginSuccess = () => {
    fetchUserProfile();
    handleCloseLogin();
  };

  const handleCloseLogin = () => setShowLoginModal(false);
  const handleShowLogin = () => setShowLoginModal(true);

  const handleCloseSignup = () => setShowSignupModal(false);
  const handleShowSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleCloseSellerLogin = () => setShowSellerLoginModal(false);
  const handleShowSellerLogin = () => {
    setShowLoginModal(false);
    setShowSellerLoginModal(true);
  };

  const handleCloseSellerSignup = () => setShowSellerSignupModal(false);
  const handleShowSellerSignup = () => {
    setShowSellerLoginModal(false);
    setShowSellerSignupModal(true);
  };

  const handleCloseOtpModal = () => setShowOtpModal(false);
  const handleShowOtpModal = (email) => {
    setEmail(email);
    setShowSignupModal(false);
    setShowOtpModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <Navbar
        expanded={expanded}
        expand="lg"
        bg="light"
        variant="light"
        className={styles.navbar}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={() => setExpanded(false)}
            className={styles.brand}
          >
            <div className={styles.brand}>
              <img src={Logo} alt="Logo Ecom" className={styles.image} />
              <h2>HuntCom</h2>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link
                as={Link}
                to="/"
                onClick={() => setExpanded(false)}
                className={styles.links}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={user && user.isSeller ? "/my-products" : "/all-products"}
                onClick={() => setExpanded(false)}
                className={styles.links}
              >
                {user && user.isSeller ? "My Products" : "Products"}
              </Nav.Link>
              {!user?.isSeller && (
                <Nav.Link
                  as={Link}
                  to={token ? "/cart" : "/"}
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      alert("Login First!");
                    } else {
                      setExpanded(false);
                    }
                  }}
                  className={styles.links}
                >
                  Cart
                </Nav.Link>
              )}
              {user && user.isSeller && (
                <Nav.Link
                  as={Link}
                  to="/orders"
                  onClick={() => setExpanded(false)}
                  className={styles.links}
                >
                  Orders
                </Nav.Link>
              )}
              <Nav.Link
                as={Link}
                to="/about"
                onClick={() => setExpanded(false)}
                className={styles.links}
              >
                About us
              </Nav.Link>
            </Nav>
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className={styles.profileIcon}
                  variant="secondary"
                >
                  <FaUserCircle size={24} />
                  <span className={styles.username}>{user.name}</span>{" "}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button
                className={styles.loginButton}
                onClick={() => {
                  setExpanded(false);
                  handleShowLogin();
                }}
              >
                Login
              </button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginModal
        show={showLoginModal}
        handleClose={handleCloseLogin}
        handleSignup={handleShowSignup}
        handleLoginAsSeller={handleShowSellerLogin}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignupModal
        show={showSignupModal}
        handleClose={handleCloseSignup}
        handleShowOtpModal={handleShowOtpModal}
      />
      <SellerLoginModal
        show={showSellerLoginModal}
        handleClose={handleCloseSellerLogin}
        handleSignupAsSeller={handleShowSellerSignup}
        onLoginSuccess={handleLoginSuccess}
      />
      <SellerSignupModal
        show={showSellerSignupModal}
        handleClose={handleCloseSellerSignup}
        handleShowOtpModal={handleShowOtpModal}
      />
      <OtpVerificationModal
        show={showOtpModal}
        handleClose={handleCloseOtpModal}
        email={email}
      />
    </>
  );
};

export default CustomNavbar;

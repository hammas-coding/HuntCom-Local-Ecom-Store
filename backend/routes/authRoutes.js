const express = require("express");
const {
  registerUser,
  verifyOtp,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;

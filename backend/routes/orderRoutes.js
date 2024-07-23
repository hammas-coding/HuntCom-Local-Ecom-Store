const express = require("express");
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getSellerOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/sellerorders").get(protect, getSellerOrders); 
router.route("/:id").get(protect, getOrderById);

module.exports = router;

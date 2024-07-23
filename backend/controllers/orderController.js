const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    try {
      const populatedOrderItems = await Promise.all(
        orderItems.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error(`Product not found: ${item.product}`);
          }
          return {
            ...item,
            seller: product.seller,
          };
        })
      );

      const order = new Order({
        user: req.user._id,
        orderItems: populatedOrderItems,
        shippingAddress,
      });

      const createdOrder = await order.save();
      console.log("Order created:", createdOrder);

      const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } },
        { new: true }
      );

      if (!updatedCart) {
        throw new Error("Failed to clear the cart.");
      }

      console.log("Cart cleared:", updatedCart);
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error("Error occurred:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    "orderItems.seller": req.user._id,
  });
  res.json(orders);
});

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getSellerOrders,
};

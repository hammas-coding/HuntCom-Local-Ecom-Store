const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  const seller = req.user._id;

  console.log("Received data:", {
    name,
    description,
    price,
    category,
    stock,
    image,
  }); 

  if (!image) {
    res.status(400);
    throw new Error("Image URL is required");
  }

  const product = new Product({
    name,
    description,
    price,
    image, 
    seller,
    category,
    stock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category;
  product.stock = stock;

  if (image) {
    product.image = image; 
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  console.log("Deleting product with ID:", req.params.id); 

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      console.log("Product not found:", req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product removed:", req.params.id); 
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

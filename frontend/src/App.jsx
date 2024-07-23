import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import SellerAllProduct from "./components/SellerAllProducts/SellerAllProducts";
import About from "./components/About/About";
import AllProducts from "./components/AllProducts/AllProducts";
import ProductDetails from "./components/ProductDetails/ProductDetails"; // Import the new component
import Cart from "./components/Cart/Cart";
import Orders from "./components/Orders/Orders";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-products" element={<SellerAllProduct />} />
        <Route path="/about" element={<About />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;

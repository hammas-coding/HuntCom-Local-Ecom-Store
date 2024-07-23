import React from "react";
import Navbar from "../Navbar/Navbar";
import Wallpaper from "../wallpaper/Wallpaper";
import ProductSection from "../ProductsSection/ProductSection";
import Footer from "../Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Wallpaper />
      <ProductSection />
      <Footer />
    </>
  );
};

export default Home;

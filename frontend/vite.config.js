import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/icons-material/Menu",
      "@mui/icons-material/Home",
      "@mui/icons-material/ShoppingCart",
      "@mui/icons-material/Info",
    ],
  },
});

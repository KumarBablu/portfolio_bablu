import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/portfolio_bablu/", // 👈 must match repo name
  plugins: [react()],
});

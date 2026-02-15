import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,

    // Required for ngrok->WSL: listen on all interfaces (not just 127.0.0.1)
    host: true,

    // Allow ngrok hostnames (Vite blocks unknown hosts by default).
    allowedHosts: [".ngrok-free.app"],

    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});


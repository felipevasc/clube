// vite.config.ts
import { defineConfig } from "file:///mnt/c/dev/clube/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.11/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/dev/clube/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@22.19.11_/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Required for ngrok->WSL: listen on all interfaces (not just 127.0.0.1)
    host: true,
    // Allow ngrok hostnames (Vite blocks unknown hosts by default).
    allowedHosts: [".ngrok-free.app"],
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvZGV2L2NsdWJlL2FwcHMvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L2MvZGV2L2NsdWJlL2FwcHMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvYy9kZXYvY2x1YmUvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG5cbiAgICAvLyBSZXF1aXJlZCBmb3Igbmdyb2stPldTTDogbGlzdGVuIG9uIGFsbCBpbnRlcmZhY2VzIChub3QganVzdCAxMjcuMC4wLjEpXG4gICAgaG9zdDogdHJ1ZSxcblxuICAgIC8vIEFsbG93IG5ncm9rIGhvc3RuYW1lcyAoVml0ZSBibG9ja3MgdW5rbm93biBob3N0cyBieSBkZWZhdWx0KS5cbiAgICBhbGxvd2VkSG9zdHM6IFtcIi5uZ3Jvay1mcmVlLmFwcFwiXSxcblxuICAgIHByb3h5OiB7XG4gICAgICBcIi9hcGlcIjogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcbiAgICB9LFxuICB9LFxufSk7XG5cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlAsU0FBUyxvQkFBb0I7QUFDMVIsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUdOLE1BQU07QUFBQTtBQUFBLElBR04sY0FBYyxDQUFDLGlCQUFpQjtBQUFBLElBRWhDLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

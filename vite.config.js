import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  resolve: {
    alias: { "react-native": "react-native-web" },
  },
});
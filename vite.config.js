import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
const NAMA_REPO = "jadwal-kapal-pijar";

// https://vite.dev/config/
export default defineConfig({
  base: `/${NAMA_REPO}/`,
  plugins: [react(), tailwindcss()],
});

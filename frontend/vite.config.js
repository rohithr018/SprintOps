import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	server: {
		host: true, // or "0.0.0.0"
	},
	plugins: [react(), tailwindcss()],
	build: {
		chunkSizeWarningLimit: 1500,
	},
});

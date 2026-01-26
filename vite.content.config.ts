import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "dist",
        emptyOutDir: false, // Don't wipe the main build!
        rollupOptions: {
            input: {
                content: path.resolve(__dirname, "src/content.tsx"),
            },
            output: {
                entryFileNames: "src/[name].js",
                format: "iife", // Self-contained for Chrome Content Script
                name: "NetflowAIContent", // Wrapper variable name
                inlineDynamicImports: true, // Force everything into one file
            },
        },
    },
    define: {
        'process.env.NODE_ENV': '"production"',
    }
});

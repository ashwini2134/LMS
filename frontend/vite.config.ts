import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({

  plugins: [
    react(),
    tailwind(),
  ],

  // IMPORTANT
  // GitHub repo name
  base: "/LMS/",

  build: {

    // Output inside frontend/dist
    outDir: "dist",

    emptyOutDir: true,

    chunkSizeWarningLimit: 1000,

    rollupOptions: {

      output: {

        manualChunks: {

          // Vendors
          "react-vendor": [
            "react",
            "react-dom",
          ],

          "router-vendor": [
            "react-router-dom",
          ],

          // App
          "auth": [
            "./src/auth.tsx",
          ],

          "api": [
            "./src/api.ts",
          ],

          // Pages
          "pages-login": [
            "./src/pages/Login.tsx",
          ],

          "pages-register": [
            "./src/pages/Register.tsx",
          ],

          "pages-dashboard": [
            "./src/pages/Dashboard.tsx",
          ],

          "pages-course": [
            "./src/pages/CoursePage.tsx",
          ],

          "pages-problem": [
            "./src/pages/ProblemPage.tsx",
          ],

          "pages-lecture": [
            "./src/pages/LecturePage.tsx",
          ],
        },
      },
    },
  },
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// 1. 這裡幫你設定預設的 PORT，本機打包才不會報錯
const rawPort = process.env.PORT || "3000";
const port = Number(rawPort);

// 2. 關鍵修改：如果是在 GitHub Actions 或本機打包，直接強制使用你的 GitHub 專案路徑
// 這樣打包出來的 HTML 才會去 /Linuua/assets/ 找 JS 檔案，才不會 404！
const basePath = "/Linuua/"; 

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    // 移除了會導致網頁報錯的 Replit 專屬插件（例如錯誤遮罩）
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    // 配合 gh-pages 插件的標準輸出路徑
    outDir: path.resolve(import.meta.dirname, "dist"), 
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
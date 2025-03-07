import { defineConfig } from "vite";

export default defineConfig({
  // 使用绝对路径'/'，确保在根目录部署
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // 确保正确处理静态资源
    assetsInlineLimit: 4096,
    // 确保生成的HTML文件正确引用资源
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // 添加服务器配置
  server: {
    port: 3000,
    open: true,
  },
  // 确保正确处理静态资源
  publicDir: "public",
});

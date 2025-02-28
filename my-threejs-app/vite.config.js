import { defineConfig } from 'vite'

export default defineConfig({
  // 将基础路径设置为相对路径，这样在任何子目录下部署都能正常工作
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保在输出中使用相对路径
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})

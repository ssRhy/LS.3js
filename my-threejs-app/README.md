# Three.js 项目部署到 Vercel 指南

这是一个详细的指南，帮助新手将 Three.js 项目成功部署到 Vercel 平台。本文档涵盖了常见的配置问题和易错点，确保您的 3D 应用能够顺利上线。

## 目录

1. [前期准备](#前期准备)
2. [项目配置](#项目配置)
   - [Vite 配置](#vite-配置)
   - [Vercel 配置](#vercel-配置)
   - [资源路径配置](#资源路径配置)
3. [部署流程](#部署流程)
4. [常见问题与解决方案](#常见问题与解决方案)
5. [性能优化建议](#性能优化建议)

## 前期准备

在开始部署前，请确保您已经：

1. 创建了一个 Vercel 账户（https://vercel.com）
2. 安装了 Node.js 和 npm
3. 安装了 Vercel CLI：`npm install -g vercel`
4. 项目中包含了必要的依赖（Three.js, Vite 等）

## 项目配置

### Vite 配置

Vite 是一个现代前端构建工具，需要正确配置才能在 Vercel 上顺利部署。创建或编辑项目根目录下的 `vite.config.js` 文件：

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  // 使用绝对路径'/'，确保在根目录部署
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保正确处理静态资源
    assetsInlineLimit: 4096,
    // 确保生成的HTML文件正确引用资源
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // 添加服务器配置
  server: {
    port: 3000,
    open: true
  },
  // 确保正确处理静态资源
  publicDir: 'public'
})
```

**易错点**：
- `base` 路径设置错误是最常见的问题。在 Vercel 上通常应设置为 `'/'`
- 不要忘记设置 `publicDir` 来指定静态资源目录

### Vercel 配置

在项目根目录创建 `vercel.json` 文件，指定部署配置：

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**易错点**：
- 确保 `outputDirectory` 与 Vite 配置中的 `outDir` 一致
- `rewrites` 规则对于单页应用（SPA）非常重要，可以处理客户端路由

### 资源路径配置

在 Three.js 项目中，正确配置资源路径至关重要：

1. **HTML 文件中的路径**：

```html
<!-- 在 index.html 中使用绝对路径 -->
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
<script type="module" src="/src/main.js"></script>
```

2. **Three.js 纹理和模型加载**：

```javascript
// 在 JavaScript 文件中加载纹理时使用绝对路径
const texture = new THREE.TextureLoader().load('/textures/example.jpg');
const model = new GLTFLoader().load('/models/example.glb');
```

**易错点**：
- 本地开发时相对路径可能有效，但部署后会失效
- 始终在加载纹理、模型等资源时使用绝对路径（以 `/` 开头）
- 确保所有资源都放在正确的目录中（如 `public` 文件夹）

## 部署流程

1. **准备项目**：
   ```bash
   # 安装依赖
   npm install
   
   # 本地测试构建
   npm run build
   ```

2. **修改 .gitignore 文件**：
   确保 `dist` 目录不被忽略（如果使用 Git 部署）。在 `.gitignore` 文件中注释掉 `dist` 行：
   ```
   # dist  # 注释掉，确保dist目录不被忽略
   ```
   
   同时添加 `.vercel` 到忽略列表：
   ```
   .vercel
   ```

3. **使用 Vercel CLI 部署**：
   ```bash
   # 登录 Vercel（如果尚未登录）
   vercel login
   
   # 部署项目
   vercel
   
   # 部署到生产环境
   vercel --prod
   ```

4. **或者通过 GitHub 集成部署**：
   - 将项目推送到 GitHub 仓库
   - 在 Vercel 控制台导入该仓库
   - 配置构建设置（通常会自动检测）
   - 点击部署

## 常见问题与解决方案

### 1. 404 错误 (NOT_FOUND)

**问题**：部署后访问网站显示 404 错误。

**解决方案**：
- 检查 `vite.config.js` 中的 `base` 路径设置
- 确认 `vercel.json` 中的 `rewrites` 规则正确
- 验证 HTML 文件中的资源路径是否正确（使用绝对路径）

### 2. 资源加载失败

**问题**：3D 模型、纹理或其他资源无法加载。

**解决方案**：
- 在 JavaScript 中使用绝对路径加载资源：`/assets/texture.jpg` 而不是 `assets/texture.jpg`
- 确保资源文件放在 `public` 目录中
- 检查浏览器控制台是否有 CORS 错误

### 3. 构建错误

**问题**：Vercel 部署过程中出现构建错误。

**解决方案**：
- 检查 `package.json` 中的构建脚本是否正确
- 确保所有依赖都已正确安装
- 查看 Vercel 构建日志以获取详细错误信息

### 4. 性能问题

**问题**：部署后 3D 场景加载缓慢或性能差。

**解决方案**：
- 压缩和优化 3D 模型和纹理
- 实现资源的懒加载
- 考虑使用 CDN 来分发大型资源

## 性能优化建议

1. **资源优化**：
   - 压缩纹理图像（使用 WebP 或其他高效格式）
   - 使用 DRACO 压缩 3D 模型
   - 考虑使用 LOD（细节层次）技术

2. **代码优化**：
   - 实现对象池来重用 Three.js 对象
   - 使用 `requestAnimationFrame` 而不是 `setInterval` 进行动画
   - 在不可见时暂停渲染循环

3. **加载策略**：
   - 实现加载进度条
   - 优先加载低分辨率资源，然后逐步提高质量
   - 使用 `Promise.all` 并行加载多个资源

---

通过遵循本指南，您应该能够成功将 Three.js 项目部署到 Vercel 平台，并避免常见的部署问题。如果您仍然遇到困难，请查阅 [Vercel 文档](https://vercel.com/docs) 或 [Three.js 文档](https://threejs.org/docs/)，或在相关社区寻求帮助。

祝您部署顺利！

<p align="center">
  <img
    src="./public/favicon.svg"
    width="88"
    height="88"
    alt="LaTeX Live"
  />
</p>

<h1 align="center">LaTeX Live</h1>

<p align="center">
  <strong
    >现代、响应式的在线 LaTeX 公式编辑器，支持实时预览与多格式导出。</strong
  >
</p>

<p align="center">
    <a href="./README.md">English</a> · <b>简体中文</b>
</p>

<div align="center">

[![GitHub deployments](https://img.shields.io/github/deployments/QChemX/LaTeXLive/Production)](https://github.com/QChemX/LaTeXLive/deployments)
[![GitHub last commit](https://img.shields.io/github/last-commit/QChemX/LaTeXLive)](https://github.com/QChemX/LaTeXLive/commits/main/)
[![GitHub License](https://img.shields.io/github/license/QChemX/LaTeXLive)](https://github.com/QChemX/LaTeXLive/blob/main/LICENSE)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/latexlive)](https://latexlive.vercel.app/)

</div>

## 简介

LaTeX Live 是一款运行在浏览器中的数学公式工作台，使用纯 React 19 构建。
它将 MathJax 实时渲染、分类符号和公式模板、图片转 LaTeX、响应式编辑体验，
以及适用于论文、办公文档、网页和其他排版系统的多格式导出整合在一个应用中。

公式编辑与渲染默认完全在浏览器本地完成。
只有当使用者主动启用图片识别并配置 OCR 接口时，
图片内容才会发送至对应的远程服务。

应用支持桌面端与移动端、浅色与深色主题、PWA 安装，以及四种界面语言。
`/docs` 路由提供面向使用者的简体中文和 English LaTeX 使用文档。

## 主要功能

### 公式编辑

- 基于 MathJax 的 SVG 实时预览。
- LaTeX 命令自动补全，支持按 `Tab` 接受建议。
- 可独立调节源码字号与预览缩放比例。
- 支持预览左对齐、居中和右对齐。
- 支持左右分栏和上下堆叠工作区布局。
- 字体颜色、字体样式和相对字号插入菜单。
- `eqnarray`、`align`、`array`、`aligned`、`gathered`、`cases`、`split` 环境辅助工具。
- 支持 `\tag`、`\notag` 和带星号环境的 AMS 方程编号。

### 符号与公式模板

- 10 类快捷工具：常用符号、希腊字母、分式、根式与上下标、极限与对数、三角函数、积分、大型运算、括号和矩阵。
- 10 类公式模板：代数、几何、不等式、微积分、矩阵、三角函数、统计、数列、物理和化学。
- 适配鼠标与触摸操作的浮动折叠菜单。

### 图片识别

- 支持上传、拖拽或粘贴 PNG、JPG 和 SVG 图片。
- 识别前可以预览和移除图片。
- 通过可配置 HTTP 接口实现可选的图片转 LaTeX 功能。
- 同时兼容直接返回和旧版兼容格式的 OCR 响应。

### 导出与分享

- 图片导出：SVG、PNG、JPG。
- 源码导出：LaTeX、ASCIIMath、Typst、HTML 行内公式、HTML 独立公式、MathML 多种形式、OMML 和 SVG Code。
- 转义输出：双反斜杠、`$...$`、`$$...$$`、`\(...\)`、`\[...\]` 和 JSON 字符串。
- 通过分享 URL 保存并恢复当前公式。
- 浏览器支持时使用系统原生分享，否则自动复制链接。

### 使用体验

- 简体中文、繁體中文、English、日本語四种界面语言。
- 首次访问时自动跟随浏览器语言。
- 支持浅色、深色和跟随系统主题。
- 适配桌面、平板和移动端屏幕。
- 支持安装的渐进式网页应用，并提供运行时资源缓存。
- `/docs` 内置简体中文和 English 的 LaTeX 使用文档。

## 技术栈

| 领域           | 技术                                                           |
| -------------- | -------------------------------------------------------------- |
| 应用基础       | React 19、Full Strict TypeScript 5、Vite 8                     |
| 样式与组件     | Tailwind CSS v4、Shadcn/UI 风格组件、Radix UI                  |
| 图标与动画     | Lucide React、React Icons、Motion                              |
| 路由           | TanStack Router，包含 Search Params 校验                       |
| 服务端状态     | TanStack Query v5                                              |
| 客户端 UI 状态 | Zustand v5，持久化用户偏好                                     |
| 数据校验       | Zod                                                            |
| 公式渲染       | MathJax SVG，以及 AMS、Physics、Mhchem、Cancel、Unicode 等扩展 |
| 格式转换       | Temml、浏览器原生 SVG 与 Canvas API                            |
| 消息提示       | Sonner                                                         |
| PWA            | Web App Manifest、Service Worker                               |
| 部署           | 可直接部署至 Vercel 的 Vite 静态产物                           |

## 快速开始

### 环境要求

- Node.js `20.19.0` 或更高版本，或者 Node.js `22.12.0` 或更高版本。
- 推荐使用 npm 10 或更高版本。
- 支持 ES Modules、SVG、Canvas 和 Clipboard API 的现代浏览器。

### 安装

```bash
git clone https://github.com/QChemX/LaTeXLive.git
cd LaTeXLive
npm install
```

启动开发服务器：

```bash
npm run dev
```

Vite 会在终端输出本地访问地址，通常为 `http://localhost:5173`。

### 可选的图片识别配置

未配置 OCR 接口时，图片识别功能默认不可用。在项目根目录创建 `.env.local`：

```dotenv
VITE_OCR_API_URL=https://example.com/api/recognize
```

前端发送的 JSON 请求格式如下：

```json
{
  "src": "data:image/png;base64,..."
}
```

接口可以直接返回以下字段：

```json
{
  "latex_styled": "\\frac{a}{b}",
  "latex": "\\frac{a}{b}",
  "text": "\\frac{a}{b}"
}
```

字段优先级为 `latex_styled`、`latex`、`text`。应用也兼容 `{ "result": 0, "detail": { "info": ... } }` 形式的旧版响应结构。

OCR 服务需要允许来自网页应用域名的跨域请求。所有以 `VITE_` 开头的变量都会写入客户端构建产物，因此不要在 `VITE_OCR_API_URL` 或其他前端环境变量中存放 API Key 等机密信息。机密凭证应由 OCR 后端保存。

### 质量检查与生产预览

```bash
npm run lint
npm run build
npm run preview
```

生产构建结果会输出到 `dist/` 目录。

## 可用命令

| 命令              | 说明                               |
| ----------------- | ---------------------------------- |
| `npm run dev`     | 启动 Vite 开发服务器               |
| `npm run lint`    | 对项目执行 ESLint 检查             |
| `npm run build`   | 执行 TypeScript 构建并生成生产版本 |
| `npm run preview` | 在本地预览生产构建结果             |

## 项目结构

```text
src/
├── app/                       # 全局 Provider 与类型安全路由
├── components/ui/             # 可复用 UI 原子组件
├── features/
│   ├── docs/                  # 双语使用文档
│   └── editor/                # 编辑器组件、Hooks、API 与导出功能
├── lib/                       # 国际化、工具函数与 PWA 注册
└── stores/                    # 持久化的 Zustand UI 偏好
public/
├── assets/                    # 符号与公式模板资源
├── mathjax/                   # 本地提供的 MathJax 运行时
├── manifest.webmanifest       # PWA 元数据
└── sw.js                      # Service Worker
```

项目遵循 Feature-First 组织方式。
来自 API 的数据由 TanStack Query 管理，Zustand 仅保存主题、语言、布局、对齐和缩放等界面偏好。

## 开源许可

本项目采用 [Apache License 2.0](./LICENSE) 开源许可。

LaTeX Live 是原始项目 [ubnm/LaTeXLive](https://github.com/ubnm/LaTeXLive) 的 React 重写版本。
重新分发由旧版迁移的资源时，请保留适用的上游声明与署名信息。

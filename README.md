<p align="center">
  <img src="./public/favicon.svg" width="88" height="88" alt="LaTeX Live logo" />
</p>

<h1 align="center">LaTeX Live</h1>

<p align="center"><strong>A modern, responsive online LaTeX formula editor with live preview and multi-format export.</strong></p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README_zh.md">简体中文</a> ·
  <a href="https://github.com/QChemX/LaTeXLive">GitHub</a>
</p>

## Overview

LaTeX Live is a browser-based mathematical formula workspace built as a pure React 19 application. It combines real-time MathJax rendering, categorized symbol and formula palettes, image-to-LaTeX integration, responsive editing, and exports for publishing, office documents, web pages, and other typesetting systems.

Formula editing and rendering happen locally in the browser. Content is sent to a remote service only when you explicitly use image recognition and configure an OCR endpoint.

The application supports desktop and mobile browsers, light and dark themes, installable PWA behavior, and four interface languages. A dedicated `/docs` route provides a practical LaTeX guide in Simplified Chinese and English.

## Key Features

### Formula editing

- Live SVG preview powered by MathJax.
- LaTeX command autocomplete with `Tab` completion.
- Adjustable source font size and preview zoom.
- Left, center, and right preview alignment.
- Split-pane and stacked workspace layouts.
- Color, font family, and relative font-size insertion menus.
- Environment helpers for `eqnarray`, `align`, `array`, `aligned`, `gathered`, `cases`, and `split`.
- AMS equation numbering with `\tag`, `\notag`, and starred environments.

### Symbols and templates

- 10 categorized quick-tool menus for symbols, Greek letters, fractions, radicals, limits, trigonometry, integrals, large operators, brackets, and matrices.
- 10 formula-template categories covering algebra, geometry, inequalities, calculus, matrices, trigonometry, statistics, sequences, physics, and chemistry.
- Floating, collapsible menus designed for both pointer and touch interaction.

### Image recognition

- Upload, drag and drop, or paste PNG, JPG, and SVG images.
- Preview and remove an image before recognition.
- Optional image-to-LaTeX integration through a configurable HTTP endpoint.
- Supports both direct and legacy-compatible OCR response structures.

### Export and sharing

- Image export: SVG, PNG, and JPG.
- Source export: LaTeX, ASCIIMath, Typst, inline HTML, block HTML, MathML variants, OMML, and SVG code.
- Escaped output: doubled backslashes, `$...$`, `$$...$$`, `\(...\)`, `\[...\]`, and JSON strings.
- Shareable URLs that restore the formula when opened.
- Native system sharing when supported, with clipboard fallback.

### User experience

- Simplified Chinese, Traditional Chinese, English, and Japanese interfaces.
- Browser-language detection on first visit.
- Light, dark, and system theme preferences.
- Responsive layouts for desktop, tablet, and mobile screens.
- Installable Progressive Web App with runtime resource caching.
- User-focused LaTeX documentation at `/docs` in Simplified Chinese and English.

## Technology Stack

| Area              | Technology                                                                     |
| ----------------- | ------------------------------------------------------------------------------ |
| Application       | React 19, TypeScript 5 in full strict mode, Vite 8                             |
| Styling           | Tailwind CSS v4, Shadcn/UI-style components, Radix UI                          |
| Icons and motion  | Lucide React, React Icons, Motion                                              |
| Routing           | TanStack Router with validated search parameters                               |
| Server state      | TanStack Query v5                                                              |
| Client UI state   | Zustand v5 with persisted preferences                                          |
| Validation        | Zod                                                                            |
| Formula rendering | MathJax SVG with AMS, Physics, Mhchem, Cancel, Unicode, and related extensions |
| Format conversion | Temml and browser-native SVG/canvas APIs                                       |
| Notifications     | Sonner                                                                         |
| PWA               | Web App Manifest and Service Worker                                            |
| Deployment        | Vercel-ready static Vite output                                                |

## Quick Start

### Requirements

- Node.js `20.19.0` or newer, or Node.js `22.12.0` or newer.
- npm 10 or newer is recommended.
- A modern browser with ES modules, SVG, Canvas, and Clipboard API support.

### Installation

```bash
git clone https://github.com/QChemX/LaTeXLive.git
cd LaTeXLive
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will print the local address, which is normally `http://localhost:5173`.

### Optional image-recognition configuration

Image recognition is disabled until an OCR endpoint is configured. Create a `.env.local` file in the project root:

```dotenv
VITE_OCR_API_URL=https://example.com/api/recognize
```

The frontend sends a JSON request:

```json
{
  "src": "data:image/png;base64,..."
}
```

The endpoint may return one of the following direct fields:

```json
{
  "latex_styled": "\\frac{a}{b}",
  "latex": "\\frac{a}{b}",
  "text": "\\frac{a}{b}"
}
```

`latex_styled` takes priority over `latex`, which takes priority over `text`. The application also accepts the legacy `{ "result": 0, "detail": { "info": ... } }` response shape.

The OCR service must allow requests from the application's origin. Because every `VITE_` variable is embedded in the client bundle, never place API keys or other secrets in `VITE_OCR_API_URL` or any frontend environment variable. Put secret credentials behind your OCR backend.

### Quality checks and production preview

```bash
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`.

## Available Scripts

| Command           | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Start the Vite development server                       |
| `npm run lint`    | Run ESLint across the project                           |
| `npm run build`   | Run the TypeScript build and create a production bundle |
| `npm run preview` | Serve the production bundle locally                     |

## Project Structure

```text
src/
├── app/                       # Global providers and typed router
├── components/ui/             # Reusable UI primitives
├── features/
│   ├── docs/                  # Bilingual user documentation
│   └── editor/                # Editor components, hooks, APIs, and exports
├── lib/                       # i18n, utilities, and PWA registration
└── stores/                    # Persisted Zustand UI preferences
public/
├── assets/                    # Symbol and template resources
├── mathjax/                   # Locally served MathJax runtime
├── manifest.webmanifest       # PWA metadata
└── sw.js                      # Service Worker
```

The application follows a feature-first structure. API-derived data stays in TanStack Query, while Zustand is limited to interface preferences such as theme, locale, layout, alignment, and zoom.

## Online Deployment

### Vercel dashboard

1. Fork or push this repository to your Git provider.
2. Import the repository in Vercel.
3. Select the Vite framework preset.
4. Use `npm run build` as the build command and `dist` as the output directory.
5. Add `VITE_OCR_API_URL` only if image recognition is required.
6. Deploy.

The included [`vercel.json`](./vercel.json) already defines the Vite build and rewrites all application routes to `index.html`, so `/docs` and shared formula URLs work after direct navigation or refresh.

You can also start from the Vercel import flow:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FQChemX%2FLaTeXLive)

### Vercel CLI

```bash
npx vercel
npx vercel --prod
```

### Other static hosts

Run `npm run build`, publish the generated `dist/` directory, and configure the host to fall back unknown routes to `index.html`. HTTPS is required for production Service Worker and installable PWA behavior.

## Browser Data and Privacy

- Formula rendering is local to the browser.
- UI preferences are stored in local storage under `latexlive-ui`.
- Share URLs contain the formula in the `formula` query parameter.
- Images are transmitted only after the user chooses recognition and only to the configured OCR endpoint.
- No analytics or account system is included by default.

## Contributing

Issues and pull requests are welcome. Before submitting a change, run:

```bash
npm run lint
npm run build
```

Keep new code strictly typed, avoid `any`, preserve the feature-first architecture, and maintain responsive and accessible behavior.

## License

This project is licensed under the [Apache License 2.0](./LICENSE.txt).

LaTeX Live is a React-based rewrite of the original [ubnm/LaTeXLive](https://github.com/ubnm/LaTeXLive). When redistributing derived legacy assets, retain applicable upstream notices and attribution.

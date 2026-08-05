/// <reference types="vite/client" />

interface MathJaxSvgOptions {
  display?: boolean;
}

interface MathJaxApi {
  startup?: { promise?: Promise<void> };
  tex2svgPromise?: (latex: string, options?: MathJaxSvgOptions) => Promise<HTMLElement>;
}

interface Window {
  MathJax?: MathJaxApi;
  temml?: {
    renderToString: (latex: string, options: { displayMode: boolean; throwOnError: boolean }) => string;
  };
}

interface ImportMetaEnv {
  readonly VITE_OCR_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

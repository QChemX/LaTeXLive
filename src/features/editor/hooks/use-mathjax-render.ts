import { useEffect, useState } from "react";
import { type PreviewStatus } from "@/features/editor/types/editor";
import { renderLatexToSvg } from "@/lib/mathjax-loader";

interface MathJaxRenderResult {
  markup: string;
  status: PreviewStatus;
  error: string | null;
}

export function useMathJaxRender(latex: string, delay = 120): MathJaxRenderResult {
  const [result, setResult] = useState<MathJaxRenderResult>({
    markup: "",
    status: "loading",
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        if (latex.trim().length === 0) {
          if (!cancelled) setResult({ markup: "", status: "ready", error: null });
          return;
        }

        try {
          const markup = await renderLatexToSvg(latex);
          if (!cancelled) {
            setResult({ markup, status: "ready", error: null });
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "公式渲染失败";
          if (!cancelled) setResult((current) => ({ ...current, status: "error", error: message }));
        }
      })();
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [delay, latex]);

  return result;
}

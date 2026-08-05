import { useEffect, useState } from "react";
import { type PreviewStatus } from "@/features/editor/types/editor";

interface MathJaxRenderResult {
  markup: string;
  status: PreviewStatus;
  error: string | null;
}

async function waitForMathJax(): Promise<Required<Pick<MathJaxApi, "tex2svgPromise">>> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const mathJax = window.MathJax;
    if (mathJax?.tex2svgPromise) {
      if (mathJax.startup?.promise) await mathJax.startup.promise;
      return { tex2svgPromise: mathJax.tex2svgPromise };
    }
    await new Promise<void>((resolve) => window.setTimeout(resolve, 80));
  }
  throw new Error("MathJax 渲染引擎加载超时");
}

export function useMathJaxRender(latex: string): MathJaxRenderResult {
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
          const mathJax = await waitForMathJax();
          const node = await mathJax.tex2svgPromise(latex, { display: true });
          if (!cancelled) {
            setResult({ markup: node.innerHTML, status: "ready", error: null });
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "公式渲染失败";
          if (!cancelled) setResult((current) => ({ ...current, status: "error", error: message }));
        }
      })();
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [latex]);

  return result;
}

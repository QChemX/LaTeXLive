type MathJaxRuntime = typeof import("@/lib/mathjax");

let runtimePromise: Promise<MathJaxRuntime> | null = null;

function loadRuntime(): Promise<MathJaxRuntime> {
  runtimePromise ??= import("@/lib/mathjax");
  return runtimePromise;
}

export async function renderLatexToSvg(latex: string, display = true): Promise<string> {
  const runtime = await loadRuntime();
  return runtime.renderLatexToSvg(latex, display);
}

export async function convertLatexToMathMl(latex: string): Promise<string> {
  const runtime = await loadRuntime();
  return runtime.convertLatexToMathMl(latex);
}

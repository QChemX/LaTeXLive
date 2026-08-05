import { z } from "zod";

const directResultSchema = z.object({
  latex: z.string().optional(),
  latex_styled: z.string().optional(),
  text: z.string().optional(),
});

const legacyResultSchema = z.object({
  result: z.number(),
  detail: z.object({
    info: z.union([z.string(), directResultSchema]).optional(),
    errinfo: z.string().optional(),
  }),
});

function extractLatex(value: unknown): string {
  const direct = directResultSchema.safeParse(value);
  if (direct.success) {
    return direct.data.latex_styled ?? direct.data.latex ?? direct.data.text ?? "";
  }

  const legacy = legacyResultSchema.safeParse(value);
  if (!legacy.success) return "";
  if (legacy.data.result !== 0) throw new Error(legacy.data.detail.errinfo ?? "图片识别失败");
  const info = typeof legacy.data.detail.info === "string"
    ? directResultSchema.safeParse(JSON.parse(legacy.data.detail.info) as unknown)
    : directResultSchema.safeParse(legacy.data.detail.info);
  if (!info.success) return "";
  return info.data.latex_styled ?? info.data.latex ?? info.data.text ?? "";
}

export async function recognizeFormulaImage(dataUrl: string): Promise<string> {
  const endpoint = import.meta.env.VITE_OCR_API_URL;
  if (!endpoint) throw new Error("OCR_API_MISSING");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ src: dataUrl }),
  });
  if (!response.ok) throw new Error(`图片识别服务返回 ${response.status}`);

  const payload: unknown = await response.json();
  const latex = extractLatex(payload).replace(/\\\(|\\\)|\\\[|\\\]/g, "");
  if (!latex) throw new Error("没有识别出有效公式");
  return latex;
}

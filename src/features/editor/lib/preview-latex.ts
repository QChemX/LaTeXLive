const categoryPreviews: Record<string, string> = {
  symbol: String.raw`a \pm b`,
  greek: String.raw`\alpha\,\beta\,\gamma`,
  frac: String.raw`\frac{a}{b}`,
  sqrt: String.raw`\sqrt{x}`,
  limit: String.raw`\lim_{x\to 0}`,
  trig: String.raw`\sin\theta`,
  integral: String.raw`\int_a^b`,
  sum: String.raw`\sum_{i=1}^n`,
  bracket: String.raw`\left( x \right)`,
  matrix: String.raw`\begin{pmatrix}a&b\\c&d\end{pmatrix}`,
  algebra: "(x-a)(x+b)",
  geometry: String.raw`\triangle ABC`,
  inequality: "a>b",
  calculous: String.raw`\frac{\mathrm d}{\mathrm dx}`,
  array: String.raw`\begin{pmatrix}1&0\\0&1\end{pmatrix}`,
  trigonometry: String.raw`e^{i\theta}`,
  statistics: String.raw`\binom nr`,
  sequence: "a_n=a_1q^{n-1}",
  physics: "F=ma",
  chemistry: String.raw`\ce{H2O}`,
};

export function menuCategoryPreview(tag: string): string {
  return categoryPreviews[tag] ?? tag;
}

export function formulaPreviewLatex(latex: string): string {
  const withoutComments = latex.replace(/%[^\n\r]*/g, "");
  const withPlaceholders = withoutComments
    .replace(/\{\}/g, "{x}")
    .replaceAll("…", "\\cdots")
    .trim();
  return withPlaceholders || "?";
}

export function controlPreviewLatex(tag: "fontfamily" | "fontsize", latex: string): string {
  if (tag === "fontfamily") return formulaPreviewLatex(latex);
  return latex.trim().replace(/}\s*$/, "Aa}");
}

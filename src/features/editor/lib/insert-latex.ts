import { type LatexSymbol } from "@/features/editor/types/editor";

export interface TextInsertion {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export function insertLatexSymbol(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  symbol: Pick<LatexSymbol, "latex" | "cursor">,
): TextInsertion {
  const selectedText = value.slice(selectionStart, selectionEnd);
  let snippet = symbol.latex;

  if (selectedText.length > 0 && snippet.includes("{}")) {
    snippet = snippet.replace("{}", `{${selectedText}}`);
  }

  const nextValue = value.slice(0, selectionStart) + snippet + value.slice(selectionEnd);
  const nextCursor = Math.max(selectionStart, selectionStart + snippet.length - symbol.cursor);

  return {
    value: nextValue,
    selectionStart: nextCursor,
    selectionEnd: nextCursor,
  };
}

export function getAutocompleteQuery(value: string, cursor: number): string | null {
  const beforeCursor = value.slice(0, cursor);
  const match = beforeCursor.match(/\\([A-Za-z]{1,32})$/);
  return match?.[1]?.toLowerCase() ?? null;
}

export type LatexEnvironment =
  | "none"
  | "eqnarray"
  | "align"
  | "array"
  | "aligned"
  | "gathered"
  | "cases"
  | "split";

export function applyLatexEnvironment(value: string, environment: LatexEnvironment): string {
  const match = value.match(/^\s*\\begin\{([a-zA-Z0-9*]+)\}(\{[a-zA-Z0-9]*\}|)\n?([\s\S]*?)\n?\\end\{\1\}\s*$/);
  let content = match?.[3] ?? value;
  const previousOption = match?.[2] ?? "";

  if (["eqnarray", "align", "aligned", "split"].includes(match?.[1] ?? "")) {
    content = content.replace(/\s*&\s*=\s*&?\s*/g, " = ");
  }
  if (environment === "none") return content;
  if (environment === "eqnarray") content = content.replace(/\s*=\s*/g, " & = & ");
  if (["align", "aligned", "split"].includes(environment)) content = content.replace(/\s*=\s*/g, " & = ");

  const option = environment === "array" ? previousOption || "{c}" : "";
  return `\\begin{${environment}}${option}\n${content}\n\\end{${environment}}`;
}

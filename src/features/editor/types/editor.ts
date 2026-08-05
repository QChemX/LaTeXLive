export const categoryTags = [
  "symbol",
  "greek",
  "frac",
  "sqrt",
  "limit",
  "trig",
  "integral",
  "sum",
  "bracket",
  "matrix",
] as const;

export type CategoryTag = (typeof categoryTags)[number];

export interface SymbolCategory {
  tag: CategoryTag;
  name: string;
  description: string;
}

export interface MenuCategory {
  tag: string;
  name: string;
  description: string;
}

export interface LatexSymbol {
  tag: string;
  name: string;
  latex: string;
  cursor: number;
  standby: string;
  zh: string;
  en: string;
  divider?: string;
}

export interface SymbolGroup {
  title: string;
  symbols: LatexSymbol[];
}

export interface EditorCatalog {
  categories: SymbolCategory[];
  symbols: Record<CategoryTag, SymbolGroup[]>;
  menus: Array<{
    id: "toolbar" | "template";
    categories: MenuCategory[];
    items: Record<string, SymbolGroup[]>;
  }>;
  controls: Record<"color" | "fontfamily" | "fontsize", LatexSymbol[]>;
  extensions: string[];
}

export interface AutocompleteItem {
  tag: string;
  command: string;
  cursor: number;
  description: string;
}

export type PreviewStatus = "loading" | "ready" | "error";

import { z } from "zod";
import {
  categoryTags,
  type AutocompleteItem,
  type CategoryTag,
  type EditorCatalog,
  type LatexSymbol,
  type SymbolGroup,
} from "@/features/editor/types/editor";
import { menuCategoryPreview } from "@/features/editor/lib/preview-latex";

const rawSymbolSchema = z.object({
  tag: z.string(),
  name: z.string(),
  latex: z.string().default(""),
  cursor: z.coerce.number().default(0),
  standby: z.string().default(""),
  zh: z.string().default(""),
  en: z.string().default(""),
  name_en: z.string().optional(),
});

const rawCatalogSchema = z.object({
  shortcut: z.array(
    z.object({
      layer1: z.object({
        cont: z.array(
          z.object({
            tag: z.string(),
            name: z.string(),
            descript: z.string(),
          }),
        ),
      }),
      layer2: z.object({
        cont: z.record(
          z.string(),
          z.object({
            cont: z.array(rawSymbolSchema),
          }),
        ),
      }),
    }),
  ),
  immediate: z.object({
    control: z.object({
      layer2: z.object({
        cont: z.record(
          z.string(),
          z.object({ cont: z.array(rawSymbolSchema) }),
        ),
      }),
    }),
  }),
  setting: z.object({
    cont: z.array(z.object({ name: z.string() })),
  }),
});

const rawAutocompleteSchema = z.object({
  map: z.array(
    z.object({
      tag: z.string(),
      cmd: z.string(),
      cursor: z.coerce.number().default(0),
      descript: z.string().default(""),
    }),
  ),
});

function isCategoryTag(value: string): value is CategoryTag {
  return categoryTags.some((tag) => tag === value);
}

function groupSymbols(items: z.infer<typeof rawSymbolSchema>[]): SymbolGroup[] {
  const groups: SymbolGroup[] = [];
  let current: SymbolGroup = { title: "常用", symbols: [] };

  for (const item of items) {
    if (item.tag === "divider") {
      if (current.symbols.length > 0) groups.push(current);
      current = { title: item.name_en ?? item.name, symbols: [] };
      continue;
    }

    const symbol: LatexSymbol = {
      tag: item.tag,
      latex: item.latex,
      cursor: item.cursor,
      standby: item.standby,
      zh: item.zh,
      en: item.en,
    };
    current.symbols.push(symbol);
  }

  if (current.symbols.length > 0) groups.push(current);
  return groups;
}

export async function fetchEditorCatalog(): Promise<EditorCatalog> {
  const response = await fetch("/data/editor-input.json");
  if (!response.ok) throw new Error("无法加载公式符号库");

  const raw: unknown = await response.json();
  const data = rawCatalogSchema.parse(raw);
  const source = data.shortcut[0];
  if (!source) throw new Error("公式符号库为空");

  const categories = source.layer1.cont.flatMap((item) =>
    isCategoryTag(item.tag)
      ? [{ tag: item.tag, description: item.descript }]
      : [],
  );

  const symbols = Object.fromEntries(
    categoryTags.map((tag) => [tag, groupSymbols(source.layer2.cont[tag]?.cont ?? [])]),
  ) as Record<CategoryTag, SymbolGroup[]>;

  const menus = data.shortcut.slice(0, 2).map((menu, index) => ({
    id: index === 0 ? "toolbar" as const : "template" as const,
    categories: menu.layer1.cont.map((item) => ({
      tag: item.tag,
      description: item.descript,
      previewLatex: menuCategoryPreview(item.tag),
    })),
    items: Object.fromEntries(
      Object.entries(menu.layer2.cont).map(([tag, group]) => [tag, groupSymbols(group.cont)]),
    ),
  }));

  if (menus.length !== 2) throw new Error("快捷工具数据不完整");

  const toControlItems = (tag: "color" | "fontfamily" | "fontsize"): LatexSymbol[] =>
    (data.immediate.control.layer2.cont[tag]?.cont ?? []).map((item) => ({
      tag: item.tag,
      latex: item.latex,
      cursor: item.cursor,
      standby: item.standby,
      zh: item.zh,
      en: item.en,
    }));

  return {
    categories,
    symbols,
    menus,
    controls: {
      color: toControlItems("color"),
      fontfamily: toControlItems("fontfamily"),
      fontsize: toControlItems("fontsize"),
    },
    extensions: data.setting.cont.map(({ name }) => name),
  };
}

export async function fetchAutocomplete(): Promise<AutocompleteItem[]> {
  const response = await fetch("/data/autocomplete.json");
  if (!response.ok) throw new Error("无法加载自动补全词典");

  const raw: unknown = await response.json();
  const data = rawAutocompleteSchema.parse(raw);
  return data.map.map((item) => ({
    tag: item.tag,
    command: item.cmd,
    cursor: item.cursor,
    description: item.descript,
  }));
}

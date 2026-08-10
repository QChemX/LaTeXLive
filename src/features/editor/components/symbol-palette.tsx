import { type ReactNode, useState } from "react";
import { BookOpen, ChevronDown, Grid2X2, ScanLine, WandSparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageRecognizer } from "@/features/editor/components/image-recognizer";
import { LatexOptionTooltip } from "@/features/editor/components/latex-option-tooltip";
import { MathJaxFormula } from "@/features/editor/components/mathjax-formula";
import { formulaPreviewLatex } from "@/features/editor/lib/preview-latex";
import { localizeLabel, paletteOptionLabel } from "@/features/editor/lib/palette-metadata";
import { type EditorCatalog, type LatexSymbol } from "@/features/editor/types/editor";
import { cn } from "@/lib/utils";
import { categoryLabel, useI18n } from "@/lib/i18n";

type InputTab = "toolbar" | "template" | "image";

interface InputToolboxProps {
  catalog: EditorCatalog;
  onInsert: (symbol: LatexSymbol) => void;
  onRecognized: (latex: string) => void;
}

interface TabButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function TabButton({ active, icon, label, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative flex min-h-12 flex-1 items-center justify-center gap-2 px-3 text-sm font-medium transition-colors sm:flex-none sm:px-5",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}{label}
      {active ? <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" /> : null}
    </button>
  );
}

function quickGridClass(category: string): string {
  if (category === "matrix") return "grid-cols-[repeat(auto-fill,minmax(7rem,1fr))]";
  if (["frac", "integral", "sum"].includes(category)) return "grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))]";
  return "grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))]";
}

function isComplexFormula(latex: string): boolean {
  const compactLength = latex.replace(/\s/g, "").length;
  return compactLength > 92 || /\\begin\{|\\cfrac|\\ce\{/.test(latex);
}

function isVeryComplexFormula(latex: string): boolean {
  const compactLength = latex.replace(/\s/g, "").length;
  const rows = (latex.match(/\\\\/g) ?? []).length + 1;
  return compactLength > 220 || rows >= 4;
}

interface BalancedTemplateLayout {
  gridClass: string;
  itemClass: string;
  formulaClass: string;
  fillOddRow: boolean;
}

function balancedTemplateLayout(category: string, symbols: LatexSymbol[]): BalancedTemplateLayout | null {
  if (category === "physics") {
    const hasMultiLineFormula = symbols.some((symbol) => (symbol.latex.match(/\\\\/g) ?? []).length >= 3);
    return {
      gridClass: "grid-cols-1",
      itemClass: hasMultiLineFormula ? "min-h-80 p-3" : "min-h-32 p-3",
      formulaClass: hasMultiLineFormula ? "h-72 text-base" : "h-24 text-base",
      fillOddRow: false,
    };
  }

  if (["statistics", "sequence"].includes(category)) {
    const hasComplexFormula = symbols.some((symbol) => isComplexFormula(symbol.latex));
    return {
      gridClass: "grid-cols-1 sm:grid-cols-2",
      itemClass: hasComplexFormula ? "min-h-48 p-3" : "min-h-28 p-3",
      formulaClass: hasComplexFormula ? "h-40 text-base" : "h-20 text-base",
      fillOddRow: symbols.length % 2 === 1,
    };
  }

  return null;
}

function optionOrdinal(symbol: LatexSymbol, fallback: number): number {
  const ordinal = Number(symbol.tag.split("_").at(-1));
  return Number.isInteger(ordinal) && ordinal > 0 ? ordinal - 1 : fallback;
}

export function InputToolbox({ catalog, onInsert, onRecognized }: InputToolboxProps) {
  const { locale, t } = useI18n();
  const [tab, setTab] = useState<InputTab>("toolbar");
  const menu = tab === "image" ? null : catalog.menus.find((item) => item.id === tab);

  return (
    <section className="overflow-visible rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-col border-b border-border sm:flex-row sm:items-center sm:justify-between sm:px-2">
        <div className="flex min-w-0" role="tablist" aria-label={t("inputArea")}>
          <TabButton active={tab === "toolbar"} icon={<WandSparkles className="size-4" />} label={t("shortcut")} onClick={() => setTab("toolbar")} />
          <TabButton active={tab === "template"} icon={<BookOpen className="size-4" />} label={t("template")} onClick={() => setTab("template")} />
          <TabButton active={tab === "image"} icon={<ScanLine className="size-4" />} label={t("imageRecognition")} onClick={() => setTab("image")} />
        </div>
        <div className="hidden items-center gap-2 pr-3 text-xs text-muted-foreground lg:flex">
          <Grid2X2 className="size-3.5" />{t("inputAreaHint")}
        </div>
      </div>

      {tab === "image" ? (
        <ImageRecognizer onRecognized={onRecognized} />
      ) : menu ? (
        <div className="flex items-stretch gap-1 overflow-x-auto p-2.5 scrollbar-none sm:gap-2 sm:p-3">
          {menu.categories.map((category, index) => {
            const groups = menu.items[category.tag] ?? [];
            const isTemplate = menu.id === "template";
            return (
              <DropdownMenu key={category.tag}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    data-palette-category={category.tag}
                    className="group flex min-h-[6.75rem] min-w-[4.75rem] flex-1 flex-col items-center justify-center rounded-xl border border-transparent px-2 py-2.5 outline-none transition hover:border-primary/20 hover:bg-primary/7 data-[state=open]:border-primary/25 data-[state=open]:bg-primary/10 sm:min-w-[5.75rem]"
                  >
                    <MathJaxFormula
                      latex={category.previewLatex}
                      label={categoryLabel(category.tag, locale, category.description)}
                      className="h-11 w-16 shrink-0 overflow-hidden text-lg"
                    />
                    <span className="mt-2 h-5 max-w-24 shrink-0 truncate text-[11px] leading-5 text-muted-foreground group-data-[state=open]:text-primary sm:text-xs">
                      {categoryLabel(category.tag, locale, category.description)}
                    </span>
                    <ChevronDown className="mt-0.5 size-3 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={index < menu.categories.length / 2 ? "start" : "end"}
                  className="max-h-[min(38rem,76vh)] w-[min(52rem,calc(100vw-1.5rem))] overflow-y-auto p-3"
                >
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>{categoryLabel(category.tag, locale, category.description)}</span>
                    <code className="font-mono font-normal text-muted-foreground">{groups.reduce((total, group) => total + group.symbols.length, 0)}</code>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {groups.map((group, groupIndex) => {
                    const balancedLayout = isTemplate ? balancedTemplateLayout(category.tag, group.symbols) : null;
                    return (
                      <div key={`${category.tag}-${groupIndex}`} className="py-2">
                        {group.title ? (
                          <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            <span>{localizeLabel(group.title, locale)}</span>
                            <span className="h-px flex-1 bg-border/80" />
                          </div>
                        ) : null}
                        <div className={cn(
                          "grid gap-2.5",
                          isTemplate ? balancedLayout?.gridClass ?? "grid-cols-1 sm:grid-cols-2" : quickGridClass(category.tag),
                        )}>
                          {group.symbols.map((symbol, symbolIndex) => {
                            const complex = isComplexFormula(symbol.latex);
                            const veryComplex = isVeryComplexFormula(symbol.latex);
                            const fillsOddRow = Boolean(
                              balancedLayout?.fillOddRow && symbolIndex === group.symbols.length - 1,
                            );
                            const label = paletteOptionLabel(
                              symbol,
                              locale,
                              category.tag,
                              optionOrdinal(symbol, symbolIndex),
                              isTemplate,
                            );
                            return (
                              <LatexOptionTooltip key={`${symbol.tag}-${symbolIndex}`} label={label} latex={symbol.latex}>
                                <DropdownMenuItem
                                  onSelect={() => onInsert(symbol)}
                                  data-palette-option={category.tag}
                                  className={cn(
                                    "grid place-items-center overflow-hidden rounded-lg border border-border/70 bg-background outline-none transition hover:border-primary/35 hover:bg-primary/7 focus-visible:ring-2 focus-visible:ring-primary/30",
                                    isTemplate
                                      ? balancedLayout
                                        ? cn(balancedLayout.itemClass, fillsOddRow && "sm:col-span-2")
                                        : veryComplex
                                          ? "min-h-80 p-3 sm:col-span-2"
                                          : complex
                                            ? "min-h-48 p-3 sm:col-span-2"
                                            : "min-h-28 p-3"
                                      : complex
                                        ? "min-h-36 p-3 sm:col-span-4"
                                        : category.tag === "matrix"
                                          ? "min-h-24 p-2"
                                          : ["frac", "integral", "sum"].includes(category.tag)
                                            ? "min-h-20 p-2"
                                            : "min-h-16 p-2",
                                  )}
                                >
                                  <MathJaxFormula
                                    latex={formulaPreviewLatex(symbol.latex)}
                                    label={label}
                                    className={cn(
                                      "w-full max-w-full overflow-hidden",
                                      isTemplate
                                        ? balancedLayout?.formulaClass
                                          ?? (veryComplex
                                            ? "h-72 text-base"
                                            : complex ? "h-40 text-base" : "h-20 text-base")
                                        : complex
                                          ? "h-28 text-base"
                                          : category.tag === "matrix"
                                            ? "h-16 text-base"
                                            : ["frac", "integral", "sum"].includes(category.tag)
                                              ? "h-14 text-base"
                                              : "h-11 text-base",
                                    )}
                                  />
                                </DropdownMenuItem>
                              </LatexOptionTooltip>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

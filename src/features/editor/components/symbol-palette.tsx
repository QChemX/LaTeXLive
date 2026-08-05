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

export function InputToolbox({ catalog, onInsert, onRecognized }: InputToolboxProps) {
  const { locale, t } = useI18n();
  const [tab, setTab] = useState<InputTab>("toolbar");
  const menu = tab === "image" ? null : catalog.menus.find((item) => item.id === tab);
  const symbolLabel = (symbol: LatexSymbol): string =>
    locale.startsWith("zh") ? symbol.zh || symbol.en || symbol.tag : symbol.en || symbol.zh || symbol.tag;

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
                    className="group flex min-w-[4.25rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-transparent px-2 py-2 outline-none transition hover:border-primary/20 hover:bg-primary/7 data-[state=open]:border-primary/25 data-[state=open]:bg-primary/10 sm:min-w-[5.5rem]"
                  >
                    <img
                      src={`/assets/img/${isTemplate ? "template" : "shortcut"}/layer1/${category.name}`}
                      alt=""
                      className="h-8 w-10 object-contain dark:rounded-md dark:bg-white dark:p-0.5 sm:h-9"
                    />
                    <span className="max-w-20 truncate text-[11px] text-muted-foreground group-data-[state=open]:text-primary sm:text-xs">
                      {categoryLabel(category.tag, locale, category.description)}
                    </span>
                    <ChevronDown className="size-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={index < menu.categories.length / 2 ? "start" : "end"}
                  className="max-h-[min(32rem,70vh)] w-[min(42rem,calc(100vw-1.5rem))] overflow-y-auto p-3"
                >
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>{categoryLabel(category.tag, locale, category.description)}</span>
                    <code className="font-mono font-normal text-muted-foreground">{groups.reduce((total, group) => total + group.symbols.length, 0)}</code>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {groups.map((group) => (
                    <div key={group.title} className="py-2">
                      <div className={cn("grid gap-2", isTemplate ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-[repeat(auto-fill,minmax(2.7rem,1fr))]") }>
                        {group.symbols.map((symbol, symbolIndex) => (
                          <DropdownMenuItem
                            key={`${symbol.tag}-${symbolIndex}`}
                            onSelect={() => onInsert(symbol)}
                            title={`${symbolLabel(symbol)}\n${symbol.latex}`}
                            className={cn(
                              "rounded-lg border border-border/70 bg-background outline-none transition hover:border-primary/35 hover:bg-primary/7 focus-visible:ring-2 focus-visible:ring-primary/30",
                              isTemplate ? "min-h-16 p-2" : "grid aspect-square min-h-10 place-items-center p-1.5",
                            )}
                          >
                            <img
                              src={`/assets/img/${isTemplate ? "template" : "shortcut"}/layer2/${category.tag}/${symbol.name.split("?")[0]}`}
                              alt={symbolLabel(symbol)}
                              loading="lazy"
                              className={cn("max-w-full object-contain", isTemplate ? "max-h-14" : "max-h-7", "dark:rounded dark:bg-white dark:p-0.5")}
                            />
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

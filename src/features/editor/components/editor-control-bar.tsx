import { Braces, ChevronDown, Eraser, Palette, TextCursorInput, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LatexOptionTooltip } from "@/features/editor/components/latex-option-tooltip";
import { MathJaxFormula } from "@/features/editor/components/mathjax-formula";
import { controlPreviewLatex } from "@/features/editor/lib/preview-latex";
import {
  colorPreviewValues,
  controlOptionLabel,
  environmentOptions,
  localizeLabel,
} from "@/features/editor/lib/palette-metadata";
import { type LatexSymbol } from "@/features/editor/types/editor";
import { type LatexEnvironment } from "@/features/editor/lib/insert-latex";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type ControlTag = "color" | "fontfamily" | "fontsize";

interface EditorControlBarProps {
  controls: Record<ControlTag, LatexSymbol[]>;
  onInsert: (symbol: LatexSymbol) => void;
  onEnvironment: (environment: LatexEnvironment) => void;
  onClear: () => void;
  clearDisabled: boolean;
}

const controlIcons = { color: Palette, fontfamily: Type, fontsize: TextCursorInput } satisfies Record<ControlTag, typeof Palette>;

export function EditorControlBar({ controls, onInsert, onEnvironment, onClear, clearDisabled }: EditorControlBarProps) {
  const { locale, t } = useI18n();
  const labels: Record<ControlTag, string> = { color: t("color"), fontfamily: t("font"), fontsize: t("size") };

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-muted/20 px-3 py-2.5 scrollbar-none">
        {(Object.keys(controls) as ControlTag[]).map((tag) => {
          const Icon = controlIcons[tag];
          return (
            <DropdownMenu key={tag}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" aria-label={labels[tag]} className="shrink-0 text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground">
                  <Icon /> <span className="editor-control-label">{labels[tag]}</span><ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 p-2.5">
                <DropdownMenuLabel>{labels[tag]}</DropdownMenuLabel>
                <div className={cn("grid gap-2", tag === "color" ? "grid-cols-4" : "grid-cols-3")}>
                  {controls[tag].map((symbol) => {
                    const optionLabel = controlOptionLabel(symbol, locale);
                    return (
                      <LatexOptionTooltip key={symbol.tag} label={optionLabel} latex={symbol.latex}>
                        <DropdownMenuItem
                          onSelect={() => onInsert(symbol)}
                          data-control-option={tag}
                          className="grid min-h-12 place-items-center overflow-hidden rounded-lg border border-border bg-background p-1.5 hover:border-primary/35 hover:bg-primary/7"
                        >
                          {tag === "color" ? (
                            <span
                              role="img"
                              aria-label={optionLabel}
                              className="size-7 rounded-full border border-black/20 shadow-sm ring-2 ring-white/80 dark:ring-black/20"
                              style={{ backgroundColor: colorPreviewValues[symbol.tag] ?? "transparent" }}
                            />
                          ) : (
                            <MathJaxFormula
                              latex={controlPreviewLatex(tag, symbol.latex)}
                              label={optionLabel}
                              className="h-9 w-full overflow-hidden text-sm"
                            />
                          )}
                        </DropdownMenuItem>
                      </LatexOptionTooltip>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" aria-label={t("environment")} className="shrink-0 text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground">
            <Braces /> <span className="editor-control-label">{t("environment")}</span><ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>{t("environment")}</DropdownMenuLabel>
          {environmentOptions.map(({ value, label, latex }) => (
            <LatexOptionTooltip key={value} label={localizeLabel(label, locale)} latex={latex}>
              <DropdownMenuItem onSelect={() => onEnvironment(value)} className="font-mono text-xs">
                {value}
              </DropdownMenuItem>
            </LatexOptionTooltip>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" aria-label={t("clear")} className="shrink-0 text-muted-foreground hover:text-destructive" onClick={onClear} disabled={clearDisabled}>
            <Eraser /><span className="editor-control-label">{t("clear")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("clear")}</TooltipContent>
      </Tooltip>
    </div>
  );
}

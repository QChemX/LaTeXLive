import { type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Eye, LoaderCircle } from "lucide-react";
import { useMathJaxRender } from "@/features/editor/hooks/use-mathjax-render";
import { cn } from "@/lib/utils";
import { useEditorUiStore } from "@/stores/editor-ui-store";
import { useI18n } from "@/lib/i18n";
import { ValueStepper } from "@/components/ui/value-stepper";

interface FormulaPreviewProps {
  latex: string;
  ref: RefObject<HTMLDivElement | null>;
}

export function FormulaPreview({ latex, ref }: FormulaPreviewProps) {
  const { t } = useI18n();
  const { markup, status, error } = useMathJaxRender(latex);
  const alignment = useEditorUiStore((state) => state.alignment);
  const scale = useEditorUiStore((state) => state.previewScale);
  const setScale = useEditorUiStore((state) => state.setPreviewScale);

  return (
    <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex min-h-14 items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Eye className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">{t("previewTitle")}</h2>
            <p className="hidden text-xs text-muted-foreground sm:block">{t("previewHint")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ValueStepper
            value={`${Math.round(scale * 100)}%`}
            label={t("previewScale")}
            decreaseLabel={t("decreasePreviewScale")}
            increaseLabel={t("increasePreviewScale")}
            onDecrease={() => setScale(Math.max(0.5, Number((scale - 0.1).toFixed(1))))}
            onIncrease={() => setScale(Math.min(2, Number((scale + 0.1).toFixed(1))))}
            decreaseDisabled={scale <= 0.5}
            increaseDisabled={scale >= 2}
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("size-1.5 rounded-full", status === "error" ? "bg-destructive" : "bg-emerald-500")} />
            <span className="hidden sm:inline">
              {status === "loading" ? t("rendering") : status === "error" ? t("invalidSyntax") : t("synced")}
            </span>
          </div>
        </div>
      </div>

      <div className="preview-grid relative flex flex-1 min-h-[325px] overflow-auto p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {status === "loading" && markup.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="m-auto flex items-center gap-2 text-sm text-muted-foreground"
            >
              <LoaderCircle className="size-4 animate-spin" />
              {t("preparing")}
            </motion.div>
          ) : latex.trim().length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="m-auto max-w-xs text-center"
            >
              <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl border border-dashed border-border bg-background/60 text-muted-foreground">
                <Eye className="size-5" />
              </div>
              <p className="text-sm font-medium">{t("emptyPreview")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("emptyPreviewHint")}</p>
            </motion.div>
          ) : (
            <motion.div
              key={markup}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex min-w-full items-center",
                alignment === "left" && "justify-start",
                alignment === "center" && "justify-center",
                alignment === "right" && "justify-end",
              )}
            >
              <div
                ref={ref}
                className="formula-output origin-center text-foreground transition-transform"
                style={{ transform: `scale(${scale})` }}
                dangerouslySetInnerHTML={{ __html: markup }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex min-h-10 items-center border-t border-border bg-muted/25 px-5 text-xs text-muted-foreground">
        {error ? (
          <span className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-3.5" />
            <span className="line-clamp-1">{t("invalidSyntax")}</span>
          </span>
        ) : (
          <span>{t("extensions")}</span>
        )}
      </div>
    </div>
  );
}

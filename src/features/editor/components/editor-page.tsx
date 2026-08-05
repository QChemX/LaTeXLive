import { useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { AppHeader } from "@/features/editor/components/app-header";
import { ExportActions } from "@/features/editor/components/export-actions";
import { FormulaPreview } from "@/features/editor/components/formula-preview";
import { SettingsDialog } from "@/features/editor/components/settings-dialog";
import { SourceEditor } from "@/features/editor/components/source-editor";
import { InputToolbox } from "@/features/editor/components/symbol-palette";
import { useEditorCatalog } from "@/features/editor/hooks/use-editor-data";
import { applyLatexEnvironment, insertLatexSymbol, type LatexEnvironment } from "@/features/editor/lib/insert-latex";
import { type LatexSymbol } from "@/features/editor/types/editor";
import { cn } from "@/lib/utils";
import { useEditorUiStore } from "@/stores/editor-ui-store";
import { useI18n } from "@/lib/i18n";

export const defaultFormula = String.raw`\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}`;

interface EditorPageProps {
  initialFormula?: string;
}

export function EditorPage({ initialFormula = defaultFormula }: EditorPageProps) {
  const { t } = useI18n();
  const [latex, setLatex] = useState(initialFormula);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const layout = useEditorUiStore((state) => state.layout);
  const catalogQuery = useEditorCatalog();
  const controls = catalogQuery.data?.controls ?? { color: [], fontfamily: [], fontsize: [] };

  const focusSelection = (start: number, end = start) => {
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, end);
    });
  };

  const insertSymbol = (symbol: LatexSymbol) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? latex.length;
    const end = textarea?.selectionEnd ?? start;
    const insertion = insertLatexSymbol(latex, start, end, symbol);
    setLatex(insertion.value);
    focusSelection(insertion.selectionStart, insertion.selectionEnd);
  };

  const acceptCompletion = (start: number, end: number, command: string, cursorOffset: number) => {
    const insertion = insertLatexSymbol(latex, start, end, {
      latex: `\\${command}`,
      cursor: cursorOffset,
    });
    setLatex(insertion.value);
    focusSelection(insertion.selectionStart, insertion.selectionEnd);
  };

  const setEnvironment = (environment: LatexEnvironment) => {
    setLatex((current) => applyLatexEnvironment(current, environment));
    focusSelection(0);
  };

  const appendRecognized = (recognizedLatex: string) => {
    setLatex((current) => `${current}${current.trim() ? "\n" : ""}${recognizedLatex}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-[1600px] space-y-4 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        {catalogQuery.isPending ? (
          <div className="h-16 animate-pulse rounded-2xl border border-border bg-card" />
        ) : catalogQuery.isError ? (
          <div className="flex items-center gap-2 rounded-2xl border border-destructive/25 bg-destructive/7 px-4 py-4 text-sm text-destructive">
            <AlertTriangle className="size-4" />
            {t("dataLoadError")}
          </div>
        ) : (
          <InputToolbox catalog={catalogQuery.data} onInsert={insertSymbol} onRecognized={appendRecognized} />
        )}

        <section
          className={cn(
            "grid gap-4",
            layout === "split" ? "xl:grid-cols-2" : "grid-cols-1",
          )}
        >
          <SourceEditor
            ref={textareaRef}
            value={latex}
            onChange={setLatex}
            onAcceptCompletion={acceptCompletion}
            controls={controls}
            onInsert={insertSymbol}
            onEnvironment={setEnvironment}
          />
          <FormulaPreview ref={previewRef} latex={latex} />
        </section>

        <ExportActions latex={latex} previewRef={previewRef} />

        <footer className="flex flex-col gap-1 px-2 pb-3 pt-2 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer")}</p>
        </footer>
      </main>

      <SettingsDialog />
    </div>
  );
}

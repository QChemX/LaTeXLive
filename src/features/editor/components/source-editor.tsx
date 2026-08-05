import { type ChangeEvent, type KeyboardEvent, type RefObject, useState } from "react";
import { Braces, WandSparkles } from "lucide-react";
import { EditorControlBar } from "@/features/editor/components/editor-control-bar";
import { useAutocomplete } from "@/features/editor/hooks/use-editor-data";
import { getAutocompleteQuery } from "@/features/editor/lib/insert-latex";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { type LatexEnvironment } from "@/features/editor/lib/insert-latex";
import { type LatexSymbol } from "@/features/editor/types/editor";
import { ValueStepper } from "@/components/ui/value-stepper";
import { useEditorUiStore } from "@/stores/editor-ui-store";

interface SourceEditorProps {
  ref: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  onAcceptCompletion: (start: number, end: number, command: string, cursorOffset: number) => void;
  controls: Record<"color" | "fontfamily" | "fontsize", LatexSymbol[]>;
  onInsert: (symbol: LatexSymbol) => void;
  onEnvironment: (environment: LatexEnvironment) => void;
}

export function SourceEditor({ ref, value, onChange, onAcceptCompletion, controls, onInsert, onEnvironment }: SourceEditorProps) {
  const { locale, t } = useI18n();
  const sourceFontSize = useEditorUiStore((state) => state.sourceFontSize);
  const setSourceFontSize = useEditorUiStore((state) => state.setSourceFontSize);
  const [cursor, setCursor] = useState(value.length);
  const query = getAutocompleteQuery(value, cursor);
  const autocompleteQuery = useAutocomplete(query !== null);
  const suggestions = query
    ? (autocompleteQuery.data ?? [])
        .filter((item) => item.tag.toLowerCase().startsWith(query))
        .slice(0, 7)
    : [];
  const lineCount = value.split("\n").length;

  const syncCursor = () => setCursor(ref.current?.selectionStart ?? 0);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    setCursor(event.target.selectionStart);
  };

  const acceptFirstSuggestion = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab" || !query || !suggestions[0]) return;
    event.preventDefault();
    onAcceptCompletion(cursor - query.length - 1, cursor, suggestions[0].command, suggestions[0].cursor);
  };

  return (
    <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex min-h-14 items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Braces className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">{t("sourceTitle")}</h2>
            <p className="hidden text-xs text-muted-foreground sm:block">{t("sourceHint")}</p>
          </div>
        </div>
        <ValueStepper
          value={`${sourceFontSize}`}
          label={t("sourceFontSize")}
          decreaseLabel={t("decreaseSourceSize")}
          increaseLabel={t("increaseSourceSize")}
          onDecrease={() => setSourceFontSize(Math.max(12, sourceFontSize - 1))}
          onIncrease={() => setSourceFontSize(Math.min(24, sourceFontSize + 1))}
          decreaseDisabled={sourceFontSize <= 12}
          increaseDisabled={sourceFontSize >= 24}
        />
      </div>

      <EditorControlBar
        controls={controls}
        onInsert={onInsert}
        onEnvironment={onEnvironment}
        onClear={() => onChange("")}
        clearDisabled={value.length === 0}
      />

      <div className="relative flex-1">
        <label htmlFor="latex-source" className="sr-only">{t("sourceTitle")}</label>
        <textarea
          ref={ref}
          id="latex-source"
          value={value}
          onChange={handleChange}
          onClick={syncCursor}
          onKeyUp={syncCursor}
          onSelect={syncCursor}
          onKeyDown={acceptFirstSuggestion}
          spellCheck={false}
          maxLength={16384}
          placeholder={t("sourcePlaceholder")}
          className="h-full min-h-[315px] w-full resize-none bg-transparent px-5 py-5 font-mono leading-7 text-foreground outline-none placeholder:text-muted-foreground/50"
          style={{ fontSize: `${sourceFontSize}px` }}
        />

        {suggestions.length > 0 && query ? (
          <div className="absolute bottom-3 left-3 right-3 z-10 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl sm:left-5 sm:right-auto sm:w-80">
            <div className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <WandSparkles className="size-3.5" />
              {t("autocomplete")}
            </div>
            {suggestions.map((item, index) => (
              <button
                key={`${item.tag}-${index}`}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onAcceptCompletion(cursor - query.length - 1, cursor, item.command, item.cursor)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-accent",
                  index === 0 && "bg-accent/70",
                )}
              >
                <code className="font-mono text-primary">\{item.tag}</code>
                <span className="truncate text-xs text-muted-foreground">
                  {locale.startsWith("zh") ? item.description || item.command : item.command}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex h-10 items-center justify-between border-t border-border bg-muted/25 px-5 text-xs text-muted-foreground">
        <span>{lineCount} {t("lines")}</span>
        <span>{value.length.toLocaleString()} / 16,384 {t("characters")}</span>
      </div>
    </div>
  );
}

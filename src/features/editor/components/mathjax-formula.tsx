import { memo } from "react";
import { useMathJaxRender } from "@/features/editor/hooks/use-mathjax-render";
import { cn } from "@/lib/utils";

interface MathJaxFormulaProps {
  latex: string;
  label: string;
  className?: string;
}

export const MathJaxFormula = memo(function MathJaxFormula({ latex, label, className }: MathJaxFormulaProps) {
  const { markup, status, error } = useMathJaxRender(latex, 0);

  return (
    <span
      role="img"
      aria-label={label}
      title={error ?? undefined}
      className={cn("mathjax-glyph", status === "loading" && "animate-pulse", className)}
    >
      {status === "error" ? (
        <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">?</span>
      ) : (
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />
      )}
    </span>
  );
});

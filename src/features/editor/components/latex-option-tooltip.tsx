import { type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LatexOptionTooltipProps {
  children: ReactNode;
  label: string;
  latex: string;
}

function tooltipLatex(latex: string): string {
  return latex.replace(/%[^\n\r]*/g, "").trim() || "—";
}

export function LatexOptionTooltip({ children, label, latex }: LatexOptionTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="z-[100] max-w-[min(36rem,calc(100vw-2rem))] space-y-1.5 px-3 py-2.5"
      >
        <div className="font-medium">{label}</div>
        <code className="block max-h-32 overflow-auto whitespace-pre-wrap break-words rounded bg-white/10 px-2 py-1 font-mono text-[11px] leading-relaxed text-slate-100">
          {tooltipLatex(latex)}
        </code>
      </TooltipContent>
    </Tooltip>
  );
}

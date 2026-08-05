import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ValueStepperProps {
  value: string;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
  className?: string;
}

export function ValueStepper({
  value,
  label,
  decreaseLabel,
  increaseLabel,
  onDecrease,
  onIncrease,
  decreaseDisabled = false,
  increaseDisabled = false,
  className,
}: ValueStepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex h-8 shrink-0 items-center overflow-hidden rounded-lg border border-border bg-background", className)}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-none border-r border-border"
        onClick={onDecrease}
        disabled={decreaseDisabled}
        aria-label={decreaseLabel}
      >
        <Minus className="size-3.5" />
      </Button>
      <output className="min-w-11 px-1 text-center text-[11px] font-medium tabular-nums text-muted-foreground">
        {value}
      </output>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-none border-l border-border"
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label={increaseLabel}
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}

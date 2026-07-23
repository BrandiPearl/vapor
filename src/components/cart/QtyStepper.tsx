"use client";

import { Minus, Plus } from "lucide-react";
import { clsx } from "clsx";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
};

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className,
  "aria-label": ariaLabel = "Quantity",
}: Props) {
  const compact = size === "sm";

  return (
    <div
      className={clsx(
        "inline-flex items-stretch overflow-hidden rounded-md border border-border bg-white",
        className?.includes("w-full") && "flex w-full",
        disabled && "opacity-50",
        className,
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={clsx(
          "flex items-center justify-center text-brand transition hover:bg-[#eef2ef] disabled:cursor-not-allowed disabled:opacity-40",
          compact ? "h-9 w-9" : "h-11 w-11",
          className?.includes("w-full") && "shrink-0",
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
      <span
        className={clsx(
          "flex flex-1 items-center justify-center border-x border-border text-sm font-semibold tabular-nums text-foreground",
          compact ? "h-9 min-w-10 px-2" : "h-11 min-w-10 px-3",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={clsx(
          "flex items-center justify-center text-brand transition hover:bg-[#eef2ef] disabled:cursor-not-allowed disabled:opacity-40",
          compact ? "h-9 w-9" : "h-11 w-11",
          className?.includes("w-full") && "shrink-0",
        )}
        aria-label="Increase quantity"
      >
        <Plus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </div>
  );
}

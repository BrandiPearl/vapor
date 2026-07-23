"use client";

import { Trash2 } from "lucide-react";
import { clsx } from "clsx";

type Props = {
  onClick: () => void;
  label?: string;
  iconOnly?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function RemoveFromCartButton({
  onClick,
  label = "Remove",
  iconOnly = false,
  size = "md",
  className,
}: Props) {
  const compact = size === "sm";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-md border border-sale/25 bg-red-50 font-semibold text-sale transition hover:border-sale/50 hover:bg-red-100 active:scale-[0.98]",
        compact ? "h-9 px-2.5 text-xs" : "h-10 px-3 text-sm",
        iconOnly && (compact ? "w-9 px-0" : "w-10 px-0"),
        className,
      )}
    >
      <Trash2 className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}

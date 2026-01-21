import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full rounded-xl border border-[#23203A] text-white dark:bg-[#07041B] bg-[#23203A] px-4 shadow-xs outline-none transition-[color,box-shadow]",
        "placeholder:text-[#89869A]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#312ECB] focus-visible:ring-[#312ECB] focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  );
}

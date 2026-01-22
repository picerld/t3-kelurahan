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
        "h-12 w-full rounded-xl border font-medium px-4 shadow-xs outline-none transition-[color,box-shadow]",
        "bg-white text-[#0F1020] border-[#D6D4E3]",
        "placeholder:text-[#6E6A86]",
        "dark:bg-input/30 dark:border-input/30 dark:text-white",
        "dark:placeholder:text-[#89869A]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#312ECB] focus-visible:ring-[#312ECB] focus-visible:ring-[3px]",

        className
      )}
      {...props}
    />
  );
}

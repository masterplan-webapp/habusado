import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: "dark" | "light";
  interactive?: boolean;
}

export function Card({
  className,
  surface = "dark",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6",
        surface === "light"
          ? "border-[#E2E8F0] bg-white text-[#021729]"
          : "border-[#1E3A52] bg-[#112536] text-white",
        interactive &&
          (surface === "light"
            ? "transition-colors hover:border-[#015E57]"
            : "transition-colors hover:border-[#015E57]"),
        className
      )}
      {...props}
    />
  );
}

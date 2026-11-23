import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "accent" | "neutral" | "reading" | "warning";

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  accent: "bg-[#015E57]/30 text-[#2DD4BF] border border-[#015E57]",
  neutral: "bg-[#021729] text-[#CBD5E1] border border-[#1E3A52]",
  reading: "bg-[#E6F4F1] text-[#015E57] border border-[#015E57]/30",
  warning: "bg-[#991B1B]/25 text-[#FCA5A5] border border-[#DC2626]/40",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "accent",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        BADGE_CLASSES[variant],
        className
      )}
      {...props}
    />
  );
}

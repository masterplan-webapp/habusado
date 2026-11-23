import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#015E57] text-white hover:bg-[#027A71] active:bg-[#014C46] border border-transparent",
  secondary:
    "bg-[#112536] text-white hover:bg-[#19334A] border border-[#1E3A52]",
  outline:
    "bg-transparent text-[#2DD4BF] border border-[#015E57] hover:bg-[#015E57] hover:text-white",
  ghost:
    "bg-transparent text-[#CBD5E1] border border-transparent hover:bg-[#112536] hover:text-white",
  danger:
    "bg-[#991B1B] text-white border border-[#DC2626]/60 hover:bg-[#B91C1C]",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

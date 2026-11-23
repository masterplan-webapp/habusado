import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  surface?: "dark" | "light";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, hint, error, id, surface = "dark", ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium",
              surface === "light" ? "text-[#021729]" : "text-white"
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-lg border-[1.5px] border-[#015E57] px-3.5 py-2.5 text-sm transition-colors focus:border-[#2DD4BF] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
            surface === "light"
              ? "bg-white text-[#021729] placeholder:text-[#64748B]"
              : "bg-[#021729] text-white placeholder:text-[#94A3B8]",
            error && "border-[#DC2626] focus:border-[#DC2626]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p
            id={hintId}
            className={cn(
              "text-xs",
              surface === "light" ? "text-[#475569]" : "text-[#94A3B8]"
            )}
          >
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-[#F87171]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  surface?: "dark" | "light";
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, hint, error, id, surface = "dark", ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium",
              surface === "light" ? "text-[#021729]" : "text-white"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-lg border-[1.5px] border-[#015E57] px-3.5 py-2.5 text-sm leading-relaxed transition-colors focus:border-[#2DD4BF] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
            surface === "light"
              ? "bg-white text-[#021729] placeholder:text-[#64748B]"
              : "bg-[#021729] text-white placeholder:text-[#94A3B8]",
            error && "border-[#DC2626] focus:border-[#DC2626]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p
            id={hintId}
            className={cn(
              "text-xs",
              surface === "light" ? "text-[#475569]" : "text-[#94A3B8]"
            )}
          >
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-[#F87171]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

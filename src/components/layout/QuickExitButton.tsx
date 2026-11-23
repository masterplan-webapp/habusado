"use client";

import { useEffect, useCallback } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickExitButtonProps {
  className?: string;
}

const EXIT_URL = "https://www.google.com";

export function QuickExitButton({ className }: QuickExitButtonProps) {
  const handleExit = useCallback(() => {
    window.location.replace(EXIT_URL);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleExit();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleExit]);

  return (
    <button
      type="button"
      onClick={handleExit}
      aria-label="Saída rápida para o Google. Também acionável pela tecla ESC."
      title="Sair imediatamente para o Google (tecla ESC)"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-[#DC2626]/60 bg-[#991B1B] px-3 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#B91C1C] active:bg-[#7F1D1D] cursor-pointer",
        className
      )}
    >
      <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Saída Rápida</span>
      <kbd className="hidden rounded-md border border-white/30 bg-black/25 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/90 sm:inline-block">
        ESC
      </kbd>
    </button>
  );
}

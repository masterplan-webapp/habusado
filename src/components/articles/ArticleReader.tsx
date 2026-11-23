"use client";

import { useState, type ReactNode } from "react";
import { Check, Moon, Share2, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleReaderProps {
  children: ReactNode;
}

const DARK_PROSE_CLASSES =
  "text-[1.0625rem] leading-[1.8] text-[#CBD5E1] " +
  "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-[1.625rem] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-white " +
  "[&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:text-white " +
  "[&_p]:mb-5 [&_p]:text-[#CBD5E1] " +
  "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-[#CBD5E1] " +
  "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-[#CBD5E1] " +
  "[&_li]:mb-2 " +
  "[&_blockquote]:my-7 [&_blockquote]:rounded-lg [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#2DD4BF] [&_blockquote]:bg-[#021729] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-white " +
  "[&_a]:text-[#2DD4BF] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white " +
  "[&_strong]:font-semibold [&_strong]:text-white";

export function ArticleReader({ children }: ArticleReaderProps) {
  const [readingMode, setReadingMode] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  }

  const isLight = readingMode === "light";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E3A52] bg-[#112536] px-4 py-3 sm:px-6">
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Conforto de leitura"
        >
          <span className="mr-1 text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
            Leitura
          </span>
          <button
            type="button"
            onClick={() => setReadingMode("dark")}
            aria-pressed={!isLight}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              !isLight
                ? "border-[#015E57] bg-[#015E57] text-white"
                : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
            )}
          >
            <Moon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Escuro</span>
          </button>
          <button
            type="button"
            onClick={() => setReadingMode("light")}
            aria-pressed={isLight}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              isLight
                ? "border-[#015E57] bg-[#015E57] text-white"
                : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
            )}
          >
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Claro</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-[#1E3A52] bg-[#021729] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition-colors hover:border-[#015E57] hover:text-white cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#2DD4BF]" aria-hidden="true" />
              <span className="text-[#2DD4BF]">Link copiado</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Compartilhar com discrição</span>
            </>
          )}
        </button>
      </div>

      <div
        className={cn(
          "rounded-xl border px-6 py-8 transition-colors sm:px-10 sm:py-12",
          isLight
            ? "border-[#E2E8F0] bg-[#F8FAFC] text-[#021729]"
            : "border-[#1E3A52] bg-[#112536] text-white"
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-[68ch]",
            isLight ? "prose-editorial" : DARK_PROSE_CLASSES
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

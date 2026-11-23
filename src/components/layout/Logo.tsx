import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Homem Abusado, página inicial"
      className={cn(
        "group inline-flex flex-col items-start leading-none focus-visible:rounded-md",
        className
      )}
    >
      <span
        className={cn(
          "font-semibold tracking-tight text-white transition-colors group-hover:text-[#2DD4BF]",
          compact ? "text-xl" : "text-2xl"
        )}
      >
        h<span className="text-[#2DD4BF]">/</span>a
      </span>
      <span
        className={cn(
          "mt-1 font-normal tracking-[0.06em] text-[#CBD5E1]",
          compact ? "text-[10px]" : "text-[11px]"
        )}
      >
        homem abusado
      </span>
    </Link>
  );
}

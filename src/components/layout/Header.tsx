"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { QuickExitButton } from "./QuickExitButton";
import { cn } from "@/lib/utils";

const PRIMARY_NAV_ITEMS = [
  { href: "/haroldo", label: "H.Aroldo" },
  { href: "/termometro", label: "Termômetro" },
  { href: "/artigos", label: "Artigos" },
  { href: "/relatos", label: "Relatos" },
  { href: "/profissionais", label: "Profissionais" },
];

const TOOLS_NAV_ITEMS = [
  {
    href: "/plano-de-seguranca",
    label: "Plano de Segurança",
    description: "Checklist prático para organização e saída segura",
  },
  {
    href: "/diario",
    label: "Diário Privado",
    description: "Registre episódios localmente, sem enviar dados",
  },
  {
    href: "/respirar",
    label: "Respirar e Acalmar",
    description: "Exercício guiado pós-crise e aterramento 5-4-3-2-1",
  },
  {
    href: "/glossario",
    label: "Glossário de Sinais",
    description: "Entenda gaslighting, DARVO e outros padrões",
  },
  {
    href: "/direitos",
    label: "Guia de Direitos",
    description: "Provas lícitas, guarda de filhos e orientação",
  },
  {
    href: "/privacidade-digital",
    label: "Privacidade Digital",
    description: "Aba anônima, histórico e proteção do celular",
  },
  {
    href: "/sobre",
    label: "Sobre o Projeto",
    description: "Nossa história, missão e canais de emergência",
  },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isToolsActive = TOOLS_NAV_ITEMS.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  useEffect(() => {
    setToolsOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setToolsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1E3A52] bg-[#021729]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 lg:flex"
        >
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#2DD4BF]"
                    : "text-[#CBD5E1] hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen((prev) => !prev)}
              aria-expanded={toolsOpen}
              aria-haspopup="menu"
              aria-controls="menu-ferramentas"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer",
                isToolsActive || toolsOpen
                  ? "text-[#2DD4BF]"
                  : "text-[#CBD5E1] hover:text-white"
              )}
            >
              <span>Ferramentas</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  toolsOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {toolsOpen && (
              <div
                id="menu-ferramentas"
                role="menu"
                aria-label="Ferramentas práticas e guias"
                className="absolute right-0 top-full mt-3 w-80 rounded-xl border border-[#015E57] bg-[#112536] p-2 shadow-2xl"
              >
                {TOOLS_NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setToolsOpen(false)}
                      className={cn(
                        "block rounded-lg px-3.5 py-2.5 transition-colors",
                        isActive
                          ? "bg-[#021729] text-[#2DD4BF]"
                          : "text-white hover:bg-[#021729]"
                      )}
                    >
                      <span className="block text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#94A3B8]">
                        {item.description}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/ajuda-urgente"
            className="hidden rounded-lg border border-[#015E57] px-3 py-2 text-xs font-medium text-[#2DD4BF] transition-colors hover:bg-[#015E57] hover:text-white md:inline-flex"
          >
            Ajuda Urgente
          </Link>

          <QuickExitButton />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="menu-mobile"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="inline-flex items-center justify-center rounded-lg border border-[#1E3A52] p-2 text-[#CBD5E1] transition-colors hover:border-[#015E57] hover:text-white lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="menu-mobile"
          aria-label="Navegação móvel"
          className="max-h-[80vh] overflow-y-auto border-t border-[#1E3A52] bg-[#021729] px-4 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#112536] text-[#2DD4BF]"
                        : "text-[#CBD5E1] hover:bg-[#112536] hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-[#1E3A52] pt-4">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
              Ferramentas e guias
            </p>
            <ul className="flex flex-col gap-1">
              {TOOLS_NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#112536] text-[#2DD4BF]"
                          : "text-[#CBD5E1] hover:bg-[#112536] hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-4 border-t border-[#1E3A52] pt-3">
            <Link
              href="/ajuda-urgente"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#2DD4BF] hover:bg-[#112536]"
            >
              Ajuda Urgente (CVV 188 e emergências)
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

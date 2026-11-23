import Link from "next/link";
import { CookiePreferencesTrigger } from "@/components/legal/CookieConsentManager";
import { PixSupportBox } from "@/components/ui/PixSupportBox";
import { Logo } from "./Logo";

const CONTENT_LINKS = [
  { href: "/artigos", label: "Artigos e guias" },
  { href: "/haroldo", label: "Conversar com o H.Aroldo" },
  { href: "/termometro", label: "Termômetro de sinais" },
  { href: "/relatos", label: "Mural de relatos" },
];

const TOOLS_LINKS = [
  { href: "/plano-de-seguranca", label: "Plano de segurança" },
  { href: "/diario", label: "Diário privado local" },
  { href: "/respirar", label: "Respirar e acalmar" },
  { href: "/glossario", label: "Glossário de sinais" },
  { href: "/direitos", label: "Guia de direitos" },
  { href: "/privacidade-digital", label: "Privacidade digital" },
];

const SUPPORT_LINKS = [
  { href: "/profissionais", label: "Diretório de profissionais" },
  { href: "/para-profissionais", label: "Para profissionais" },
  { href: "/colaboradores", label: "Escrever artigos" },
  { href: "/sobre", label: "Sobre o projeto" },
  { href: "/ajuda-urgente", label: "Ajuda urgente" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1E3A52] bg-[#021729] text-[#CBD5E1]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo compact />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#CBD5E1]">
              Informação direta, escuta sigilosa e apoio prático para homens que
              precisam reconhecer sinais de abuso e reconstruir a própria vida.
            </p>
            <p className="mt-4 text-xs text-[#94A3B8]">
              Em caso de risco imediato, ligue para a Polícia Militar (190) ou
              para o Centro de Valorização da Vida (CVV 188, 24h, gratuito).
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">
              Conteúdo
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CONTENT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#CBD5E1] transition-colors hover:text-[#2DD4BF]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">
              Ferramentas
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TOOLS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#CBD5E1] transition-colors hover:text-[#2DD4BF]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">
              Apoio
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#CBD5E1] transition-colors hover:text-[#2DD4BF]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PixSupportBox variant="compact" />

        <div className="mt-8 flex flex-col gap-3 border-t border-[#1E3A52] pt-6 text-xs text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Homem Abusado. Conteúdo informativo; não substitui atendimento
            médico, psicológico ou jurídico.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacidade"
              className="underline underline-offset-4 transition-colors hover:text-[#2DD4BF]"
            >
              Privacidade (LGPD)
            </Link>
            <Link
              href="/termos"
              className="underline underline-offset-4 transition-colors hover:text-[#2DD4BF]"
            >
              Termos de Uso
            </Link>
            <CookiePreferencesTrigger />
            <span>ESC para saída rápida</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

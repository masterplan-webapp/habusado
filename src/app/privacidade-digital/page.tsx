import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  KeyRound,
  Lock,
  Shield,
} from "lucide-react";
import { DIGITAL_PRIVACY_GUIDE } from "@/data/safety-plan";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Privacidade Digital",
  description:
    "Passos diretos para navegar em modo anônimo, limpar histórico sem chamar atenção, revisar localização compartilhada e desconectar sessões antigas.",
};

export default function PrivacidadeDigitalPage() {
  return (
    <div className="bg-[#021729]">
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span>Proteção de Dispositivos e Contas</span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Guia de Privacidade Digital
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
              Passos objetivos para proteger sua navegação, evitar rastreamento
              em aparelhos compartilhados e manter suas buscas por ajuda sob o
              seu controle.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Global ESC Quick Exit Reminder */}
        <div className="mb-10 flex flex-col justify-between gap-4 rounded-xl border border-[#015E57] bg-[#112536] p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-4">
            <Shield
              className="mt-0.5 h-5 w-5 shrink-0 text-[#2DD4BF]"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#2DD4BF]">
                Atalho de segurança em todo o site
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
                Pressione a tecla{" "}
                <kbd className="rounded-md border border-[#1E3A52] bg-[#021729] px-1.5 py-0.5 font-mono text-xs text-white">
                  ESC
                </kbd>{" "}
                ou clique em Saída Rápida no topo da tela para substituir esta
                página imediatamente pelo Google. Esse atalho ajuda na tela
                aberta, mas não apaga o histórico de páginas já visitadas fora
                da aba anônima.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Platform/Privacy Guides */}
        <div className="grid gap-6 md:grid-cols-2">
          {DIGITAL_PRIVACY_GUIDE.map((guide, guideIndex) => (
            <article
              key={guide.id}
              id={guide.id}
              className="flex flex-col rounded-xl border border-[#1E3A52] bg-[#112536] p-6"
            >
              <div className="flex items-start gap-3 border-b border-[#1E3A52] pb-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#015E57] bg-[#021729] text-sm font-semibold text-[#2DD4BF]">
                  {guideIndex + 1}
                </span>
                <h2 className="text-lg font-semibold leading-snug text-white">
                  {guide.platform}
                </h2>
              </div>

              <ol className="mt-5 space-y-3 text-sm leading-relaxed text-[#CBD5E1]">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#1E3A52] bg-[#021729] text-xs font-semibold text-[#2DD4BF]">
                      {stepIndex + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        {/* Next step CTA */}
        <div className="mt-12 flex flex-col justify-between gap-6 rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              <span>Próximo passo prático</span>
            </div>
            <h2 className="text-lg font-semibold text-white">
              Monte seu Plano de Segurança pessoal com calma
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Organize documentos, proteção financeira e rede de apoio em um
              checklist 100% local no seu navegador, que pode ser salvo em texto
              ou impresso.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/plano-de-seguranca"
              className={buttonClasses({ variant: "primary", size: "md" })}
            >
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              <span>Abrir Plano de Segurança</span>
            </Link>
            <Link
              href="/diario"
              className={buttonClasses({ variant: "secondary", size: "md" })}
            >
              <span>Diário Privado</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { CheckCircle2, PenLine, ShieldCheck } from "lucide-react";
import { ContributorArticleForm } from "@/components/articles/ContributorArticleForm";

export const metadata: Metadata = {
  title: "Escrever Artigos",
  description:
    "Envie artigos informativos para a curadoria editorial do Homem Abusado. Espaço aberto a psicólogos, advogados, médicos, terapeutas e pesquisadores.",
};

const GUIDELINES = [
  "Quem pode contribuir: psicólogos, advogados, médicos, terapeutas, pesquisadores e escritores com formação ou experiência comprovada no tema.",
  "Todo texto passa por revisão editorial antes de ser publicado para garantir clareza, respeito e alinhamento ao tom acolhedor do portal.",
  "Os artigos devem ter caráter educativo e geral, sem diagnósticos individuais e sem exposição de casos reais identificáveis.",
  "Seu e-mail é usado apenas pela curadoria para retorno editorial e nunca aparece publicamente na página do artigo.",
];

export default function ColaboradoresPage() {
  return (
    <div className="bg-[#021729]">
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <PenLine className="h-4 w-4" aria-hidden="true" />
              <span>Colaboradores Qualificados</span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Compartilhe conhecimento qualificado com quem precisa de clareza
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
              Convidamos especialistas em saúde mental, Direito de Família,
              paternidade e proteção emocional a enviar artigos objetivos para a
              nossa biblioteca editorial.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Editorial Guidelines */}
        <div className="mb-10 rounded-xl border border-[#015E57] bg-[#112536] p-6 sm:p-8">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Diretrizes Editoriais</span>
          </div>

          <ul className="space-y-3 text-sm leading-relaxed text-[#CBD5E1]">
            {GUIDELINES.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4BF]"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <ContributorArticleForm />
      </section>
    </div>
  );
}

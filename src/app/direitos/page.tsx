import type { Metadata } from "next";
import Link from "next/link";
import {
  Info,
  Lightbulb,
  Scale,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { RIGHTS_DISCLAIMER, RIGHTS_GUIDE_SECTIONS } from "@/data/rights-guide";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Guia de Direitos e Provas",
  description:
    "Noções práticas sobre preservação lícita de provas, guarda e convivência com filhos, alienação parental, defesa contra falsas acusações e Defensoria Pública no Brasil.",
};

export default function DireitosPage() {
  return (
    <div className="bg-[#021729]">
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <Scale className="h-4 w-4" aria-hidden="true" />
              <span>Informação Jurídica Básica</span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Guia de Direitos e Preservação de Provas
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
              Orientações gerais baseadas na legislação brasileira para ajudar
              você a se proteger com serenidade, evitar erros comuns e chegar
              mais preparado a uma consulta jurídica.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Prominent, calm legal disclaimer */}
        <div
          role="note"
          aria-label="Aviso legal"
          className="mb-10 flex items-start gap-4 rounded-xl border border-[#015E57] bg-[#112536] p-5 sm:p-6"
        >
          <Info
            className="mt-0.5 h-5 w-5 shrink-0 text-[#2DD4BF]"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#2DD4BF]">
              Aviso importante
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#CBD5E1]">
              {RIGHTS_DISCLAIMER}
            </p>
          </div>
        </div>

        {/* Quick anchor navigation */}
        <nav
          aria-label="Navegação rápida das seções do guia"
          className="mb-10 rounded-xl border border-[#1E3A52] bg-[#112536] p-5 sm:p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
            Ir direto para o assunto
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {RIGHTS_GUIDE_SECTIONS.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#1E3A52] bg-[#021729] px-3.5 py-2 text-xs font-medium text-[#CBD5E1] transition-colors hover:border-[#015E57] hover:text-white"
              >
                <span className="font-semibold text-[#2DD4BF]">
                  {index + 1}.
                </span>
                <span>{section.title}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Sections */}
        <div className="space-y-8">
          {RIGHTS_GUIDE_SECTIONS.map((section, index) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#015E57] bg-[#021729] text-sm font-semibold text-[#2DD4BF]">
                  {index + 1}
                </span>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  {section.title}
                </h2>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#CBD5E1] sm:text-base">
                {section.summary}
              </p>

              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[#CBD5E1]">
                {section.points.map((point, pointIdx) => (
                  <li key={pointIdx} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4BF]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-lg border-l-[3px] border-[#015E57] bg-[#021729] p-4 sm:p-5">
                <div className="mb-1.5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#2DD4BF]">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                  <span>Dica prática</span>
                </div>
                <p className="text-sm leading-relaxed text-white">
                  {section.practicalTip}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col justify-between gap-6 rounded-xl border border-[#015E57] bg-[#112536] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold text-white">
              Precisa de orientação individualizada para o seu caso?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Encontre advogados de família e psicólogos na Rede de
              Profissionais ou acesse o telefone da Defensoria Pública (129) em
              Ajuda Urgente.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/profissionais"
              className={buttonClasses({ variant: "primary", size: "md" })}
            >
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              <span>Ver Profissionais</span>
            </Link>
            <Link
              href="/ajuda-urgente"
              className={buttonClasses({ variant: "secondary", size: "md" })}
            >
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              <span>Ajuda Urgente</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

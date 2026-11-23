import type { Metadata } from "next";
import Link from "next/link";
import { Activity, BookMarked, MessageCircle } from "lucide-react";
import { GLOSSARY_TERMS } from "@/data/glossary-terms";
import { GlossaryExplorer } from "@/components/glossary/GlossaryExplorer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buttonClasses } from "@/components/ui/Button";
import { buildCanonicalUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Glossário de Dinâmicas Abusivas",
  description:
    "Conheça os principais termos usados para descrever abuso psicológico, controle financeiro, isolamento e manipulação em relacionamentos, com exemplos reais e formas práticas de lidar.",
  alternates: {
    canonical: buildCanonicalUrl("/glossario"),
  },
};

export default function GlossarioPage() {
  const glossaryUrl = buildCanonicalUrl("/glossario");
  const glossarySchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${glossaryUrl}#termset`,
    name: "Glossário de Dinâmicas Abusivas | Homem Abusado",
    description:
      "Definições práticas de dinâmicas comuns em relacionamentos abusivos contra homens.",
    inLanguage: "pt-BR",
    url: glossaryUrl,
    hasDefinedTerm: GLOSSARY_TERMS.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.summary,
      inDefinedTermSet: `${glossaryUrl}#termset`,
    })),
  };

  return (
    <div className="bg-[#021729]">
      <JsonLd data={glossarySchema} />
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <BookMarked className="h-4 w-4" aria-hidden="true" />
              <span>Clareza de Vocabulário</span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Glossário de Dinâmicas Abusivas
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
              Dar nome ao que acontece dentro de casa reduz a confusão mental.
              Consulte definições diretas, exemplos cotidianos e orientações
              práticas para cada comportamento.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <GlossaryExplorer terms={GLOSSARY_TERMS} />

        <div className="mt-14 flex flex-col justify-between gap-6 rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold text-white">
              Reconheceu vários desses comportamentos na sua rotina?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Faça uma avaliação anônima no Termômetro de Sinais ou converse com
              o H.Aroldo para organizar o que você está vivendo com calma.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/termometro"
              className={buttonClasses({ variant: "primary", size: "md" })}
            >
              <Activity className="h-4 w-4" aria-hidden="true" />
              <span>Fazer o Termômetro</span>
            </Link>
            <Link
              href="/haroldo"
              className={buttonClasses({ variant: "secondary", size: "md" })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Conversar com o H.Aroldo</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

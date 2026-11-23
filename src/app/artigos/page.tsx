import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, PenLine } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { ArticlesGrid } from "@/components/articles/ArticlesGrid";
import { buttonClasses } from "@/components/ui/Button";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Artigos",
  description:
    "Textos editoriais sobre sinais de abuso emocional, saúde mental masculina, paternidade e reconstrução da autoestima.",
};

export default async function ArtigosPage() {
  const articles = await getAllArticles();

  return (
    <div className="bg-[#021729]">
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Biblioteca Editorial</span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Artigos para compreender o que você vive
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
              Leitura direta e fundamentada sobre dinâmicas de abuso
              psicológico, limites, saúde mental e reorganização da vida após
              relacionamentos difíceis.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ArticlesGrid articles={articles} />

        <div className="mt-14 flex flex-col justify-between gap-6 rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <PenLine className="h-4 w-4" aria-hidden="true" />
              <span>Colaboração Editorial</span>
            </div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Você é profissional ou pesquisador da área?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Psicólogos, advogados, médicos, terapeutas e pesquisadores podem
              enviar textos informativos para nossa curadoria editorial.
            </p>
          </div>

          <Link
            href="/colaboradores"
            className={buttonClasses({
              variant: "secondary",
              size: "md",
              className: "shrink-0",
            })}
          >
            <span>Enviar artigo para revisão</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10">
          <NewsletterBanner
            title="Receba novos artigos com total discrição"
            description="Seu e-mail nunca é compartilhado com terceiros. Enviamos apenas textos editoriais e guias práticos, com cancelamento simples a qualquer momento."
          />
        </div>
      </section>
    </div>
  );
}

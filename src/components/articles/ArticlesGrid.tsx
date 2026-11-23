"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import type { ArticleCategory, ArticleMeta } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDatePtBr } from "@/lib/utils";

type CategoryFilter = "Todos" | ArticleCategory;

const CATEGORIES: CategoryFilter[] = [
  "Todos",
  "Sinais de Abuso",
  "Reconstrução",
  "Paternidade e Família",
  "Saúde Mental",
];

interface ArticlesGridProps {
  articles: ArticleMeta[];
}

export function ArticlesGrid({ articles }: ArticlesGridProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("Todos");

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "Todos") {
      return articles;
    }
    return articles.filter((article) => article.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtrar artigos por categoria"
        className="mb-8 flex flex-wrap gap-2 border-b border-[#1E3A52] pb-6"
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          const count =
            category === "Todos"
              ? articles.length
              : articles.filter((item) => item.category === category).length;

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "border-[#015E57] bg-[#015E57] text-white"
                  : "border-[#1E3A52] bg-[#112536] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
              )}
            >
              <span>{category}</span>
              <span
                className={cn(
                  "text-xs",
                  isActive ? "text-white/80" : "text-[#94A3B8]"
                )}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="rounded-xl border border-[#1E3A52] bg-[#112536] p-10 text-center">
          <p className="text-base font-medium text-white">
            Ainda não há artigos publicados nesta categoria.
          </p>
          <p className="mt-2 text-sm text-[#CBD5E1]">
            Selecione outra categoria acima para continuar a leitura.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#1E3A52] bg-[#112536] transition-colors hover:border-[#015E57]"
            >
              <Link
                href={`/artigos/${article.slug}`}
                className="relative block aspect-[16/9] w-full overflow-hidden bg-[#021729]"
              >
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#021729]/80 via-[#021729]/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-3 left-4">
                  <Badge variant="accent">{article.category}</Badge>
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                  <time dateTime={article.publishedAt}>
                    {formatDatePtBr(article.publishedAt)}
                  </time>
                  <span aria-hidden="true">/</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-semibold leading-snug text-white transition-colors group-hover:text-[#2DD4BF]">
                  <Link href={`/artigos/${article.slug}`}>{article.title}</Link>
                </h2>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#CBD5E1]">
                  {article.excerpt}
                </p>

                <div className="mt-6 border-t border-[#1E3A52] pt-4">
                  <Link
                    href={`/artigos/${article.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#2DD4BF] transition-colors hover:text-white"
                  >
                    <span>Ler artigo completo</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

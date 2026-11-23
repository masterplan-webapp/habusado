"use client";

import { useMemo, useState } from "react";
import { BookMarked, Compass, MessageSquareQuote, Search, X } from "lucide-react";
import type { GlossaryTerm } from "@/data/glossary-terms";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface GlossaryExplorerProps {
  terms: GlossaryTerm[];
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function GlossaryExplorer({ terms }: GlossaryExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(terms.map((item) => item.category)));
    return ["Todos", ...unique];
  }, [terms]);

  const filteredTerms = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());

    return terms.filter((item) => {
      const matchesCategory =
        selectedCategory === "Todos" || item.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const searchable = normalizeText(
        `${item.term} ${item.summary} ${item.everydayExample} ${item.category}`
      );
      return searchable.includes(normalizedQuery);
    });
  }, [terms, query, selectedCategory]);

  return (
    <div>
      {/* Search + Category Filters */}
      <div className="mb-8 space-y-5 rounded-xl border border-[#1E3A52] bg-[#112536] p-5 sm:p-6">
        <div>
          <label
            htmlFor="glossario-busca"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-[#CBD5E1]"
          >
            Buscar termo, situação ou exemplo
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <input
              id="glossario-busca"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: gaslighting, silêncio, dinheiro, isolamento..."
              className="w-full rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-[#94A3B8] focus:border-[#2DD4BF] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Filtrar termos por categoria"
          className="flex flex-wrap gap-2"
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            const count =
              category === "Todos"
                ? terms.length
                : terms.filter((item) => item.category === category).length;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  isActive
                    ? "border-[#015E57] bg-[#015E57] text-white"
                    : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
                )}
              >
                <span>{category}</span>
                <span
                  className={cn(
                    isActive ? "text-white/80" : "text-[#94A3B8]"
                  )}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <p className="mb-6 text-xs text-[#94A3B8]">
        Exibindo{" "}
        <span className="font-semibold text-white">{filteredTerms.length}</span>{" "}
        de {terms.length} termos
      </p>

      {filteredTerms.length === 0 ? (
        <div className="rounded-xl border border-[#1E3A52] bg-[#112536] p-10 text-center">
          <BookMarked
            className="mx-auto h-7 w-7 text-[#2DD4BF]"
            aria-hidden="true"
          />
          <p className="mt-3 text-base font-medium text-white">
            Nenhum termo encontrado para esse filtro.
          </p>
          <p className="mt-1 text-sm text-[#CBD5E1]">
            Tente outra palavra ou volte para todas as categorias.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("Todos");
            }}
            className="mt-5 inline-flex items-center rounded-lg border border-[#015E57] bg-[#015E57] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#027A71] cursor-pointer"
          >
            Mostrar todos os termos
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTerms.map((item) => (
            <article
              key={item.slug}
              id={item.slug}
              className="flex flex-col rounded-xl border border-[#015E57]/60 bg-[#112536] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">
                  {item.term}
                </h2>
                <Badge variant="accent">{item.category}</Badge>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#CBD5E1]">
                {item.summary}
              </p>

              <div className="mt-5 rounded-lg border-l-[3px] border-[#015E57] bg-[#021729] p-4">
                <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#2DD4BF]">
                  <MessageSquareQuote
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  <span>Exemplo no cotidiano</span>
                </div>
                <p className="text-sm leading-relaxed text-[#CBD5E1]">
                  {item.everydayExample}
                </p>
              </div>

              <div className="mt-4 flex-1 rounded-lg border-l-[3px] border-[#2DD4BF] bg-[#021729] p-4">
                <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                  <Compass className="h-3.5 w-3.5 text-[#2DD4BF]" aria-hidden="true" />
                  <span>Como lidar</span>
                </div>
                <p className="text-sm leading-relaxed text-[#CBD5E1]">
                  {item.howToRespond}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

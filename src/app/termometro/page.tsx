import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import {
  ThermometerQuiz,
  type ThermometerArticleCard,
} from "@/components/thermometer/ThermometerQuiz";

export const metadata: Metadata = {
  title: "Termômetro de Sinais",
  description:
    "Questionário anônimo de 10 perguntas para observar padrões de desgaste emocional e controle no seu relacionamento.",
};

function loadArticlesMap(): Record<string, ThermometerArticleCard> {
  const articlesDir = path.join(process.cwd(), "content", "articles");
  const result: Record<string, ThermometerArticleCard> = {};

  if (!fs.existsSync(articlesDir)) {
    return result;
  }

  const files = fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(articlesDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    const slug =
      typeof data.slug === "string" && data.slug.trim()
        ? data.slug.trim()
        : file.replace(/\.mdx?$/, "");

    result[slug] = {
      slug,
      title: typeof data.title === "string" ? data.title : slug,
      excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
      category: typeof data.category === "string" ? data.category : "Artigo",
      readTime: typeof data.readTime === "string" ? data.readTime : "",
    };
  }

  return result;
}

export default function TermometroPage() {
  const articlesBySlug = loadArticlesMap();

  return (
    <div className="bg-[#021729] py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-[#1E3A52] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2DD4BF]">
            Autoavaliação anônima
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Termômetro de Sinais
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-[#CBD5E1]">
            Responda com calma a 10 perguntas sobre a sua rotina recente. Nada é
            gravado, rastreado ou enviado para terceiros. Ao final, você recebe
            uma leitura serena dos sinais e sugestões de leitura.
          </p>
        </header>

        <ThermometerQuiz articlesBySlug={articlesBySlug} />
      </div>
    </div>
  );
}

import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

interface StaticRouteEntry {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

const STATIC_ROUTES: StaticRouteEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/artigos", changeFrequency: "weekly", priority: 0.9 },
  { path: "/haroldo", changeFrequency: "monthly", priority: 0.9 },
  { path: "/termometro", changeFrequency: "monthly", priority: 0.9 },
  { path: "/glossario", changeFrequency: "monthly", priority: 0.85 },
  { path: "/direitos", changeFrequency: "monthly", priority: 0.85 },
  { path: "/plano-de-seguranca", changeFrequency: "monthly", priority: 0.85 },
  { path: "/profissionais", changeFrequency: "weekly", priority: 0.85 },
  { path: "/relatos", changeFrequency: "weekly", priority: 0.8 },
  { path: "/ajuda-urgente", changeFrequency: "monthly", priority: 0.85 },
  { path: "/diario", changeFrequency: "monthly", priority: 0.75 },
  { path: "/respirar", changeFrequency: "monthly", priority: 0.75 },
  { path: "/privacidade-digital", changeFrequency: "monthly", priority: 0.75 },
  { path: "/sobre", changeFrequency: "monthly", priority: 0.75 },
  { path: "/para-profissionais", changeFrequency: "monthly", priority: 0.65 },
  { path: "/colaboradores", changeFrequency: "monthly", priority: 0.65 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const articles = await getAllArticles();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((entry) => ({
    url: entry.path === "/" ? baseUrl : `${baseUrl}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/artigos/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...articleEntries];
}

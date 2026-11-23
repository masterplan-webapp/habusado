import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ArticleCategory, ArticleMeta } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabase";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

const VALID_CATEGORIES: ReadonlySet<ArticleCategory> = new Set([
  "Sinais de Abuso",
  "Reconstrução",
  "Paternidade e Família",
  "Saúde Mental",
]);

const PUBLIC_SUPABASE_COLUMNS =
  "slug, title, excerpt, category, content, cover_image, tags, read_time, author_name, author_credentials, author_bio, published_at, created_at";

interface PublicSupabaseArticleRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  cover_image: string | null;
  tags: string[] | null;
  read_time: string | null;
  author_name: string | null;
  author_credentials: string | null;
  author_bio: string | null;
  published_at: string | null;
  created_at: string;
}

function normalizeCategory(value: unknown): ArticleCategory {
  if (typeof value === "string" && VALID_CATEGORIES.has(value as ArticleCategory)) {
    return value as ArticleCategory;
  }
  return "Sinais de Abuso";
}

function parseMeta(
  fileName: string,
  data: Record<string, unknown>
): ArticleMeta {
  const fallbackSlug = fileName.replace(/\.mdx$/, "");
  const slug =
    typeof data.slug === "string" && data.slug.trim().length > 0
      ? data.slug.trim()
      : fallbackSlug;

  const tags = Array.isArray(data.tags)
    ? data.tags.filter((item): item is string => typeof item === "string")
    : [];

  return {
    slug,
    title: typeof data.title === "string" ? data.title : fallbackSlug,
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    category: normalizeCategory(data.category),
    publishedAt:
      typeof data.publishedAt === "string" ? data.publishedAt : "2026-01-01",
    readTime:
      typeof data.readTime === "string" ? data.readTime : "5 min de leitura",
    coverImage:
      typeof data.coverImage === "string"
        ? data.coverImage
        : "/images/pillar-info.png",
    tags,
    author:
      typeof data.author === "string" ? data.author : "Equipe Homem Abusado",
    authorCredentials:
      typeof data.authorCredentials === "string" &&
      data.authorCredentials.trim().length > 0
        ? data.authorCredentials.trim()
        : undefined,
    authorBio:
      typeof data.authorBio === "string" && data.authorBio.trim().length > 0
        ? data.authorBio.trim()
        : undefined,
  };
}

function mapSupabaseRowToMeta(row: PublicSupabaseArticleRow): ArticleMeta {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: normalizeCategory(row.category),
    publishedAt: row.published_at || row.created_at || "2026-01-01",
    readTime: row.read_time?.trim() || "5 min de leitura",
    coverImage: row.cover_image?.trim() || "/images/pillar-info.png",
    tags: Array.isArray(row.tags)
      ? row.tags.filter((item): item is string => typeof item === "string")
      : [],
    author: row.author_name?.trim() || "Equipe Homem Abusado",
    authorCredentials: row.author_credentials?.trim() || undefined,
    authorBio: row.author_bio?.trim() || undefined,
  };
}

function getMdxFileNames(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return [];
  }
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".mdx"));
}

function readLocalArticles(): ArticleMeta[] {
  const files = getMdxFileNames();

  return files.map((fileName) => {
    const fullPath = path.join(ARTICLES_DIR, fileName);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);
    return parseMeta(fileName, data as Record<string, unknown>);
  });
}

function readLocalArticleBySlug(
  slug: string
): { meta: ArticleMeta; content: string } | null {
  const files = getMdxFileNames();

  for (const fileName of files) {
    const fullPath = path.join(ARTICLES_DIR, fileName);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const meta = parseMeta(fileName, data as Record<string, unknown>);
    if (meta.slug === slug) {
      return { meta, content };
    }
  }

  return null;
}

async function fetchPublishedSupabaseArticles(): Promise<ArticleMeta[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(PUBLIC_SUPABASE_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !Array.isArray(data)) {
      return [];
    }

    return (data as PublicSupabaseArticleRow[]).map(mapSupabaseRowToMeta);
  } catch {
    return [];
  }
}

async function fetchPublishedSupabaseArticleBySlug(
  slug: string
): Promise<{ meta: ArticleMeta; content: string } | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(PUBLIC_SUPABASE_COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const row = data as PublicSupabaseArticleRow;
    return {
      meta: mapSupabaseRowToMeta(row),
      content: row.content ?? "",
    };
  } catch {
    return null;
  }
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parsePublishedTimestamp(publishedAt: string): number {
  const trimmed = publishedAt.trim();
  if (DATE_ONLY_PATTERN.test(trimmed)) {
    return Date.parse(`${trimmed}T00:00:00-03:00`);
  }
  return Date.parse(trimmed);
}

export function isPublishedNow(publishedAt: string): boolean {
  const timestamp = parsePublishedTimestamp(publishedAt);
  if (Number.isNaN(timestamp)) {
    return false;
  }
  return timestamp <= Date.now();
}

export function getScheduledMdxArticles(): ArticleMeta[] {
  return readLocalArticles()
    .filter((article) => !isPublishedNow(article.publishedAt))
    .sort((a, b) => {
      const timeA = parsePublishedTimestamp(a.publishedAt) || 0;
      const timeB = parsePublishedTimestamp(b.publishedAt) || 0;
      return timeA - timeB;
    });
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const localArticles = readLocalArticles();
  const remoteArticles = await fetchPublishedSupabaseArticles();

  const mergedBySlug = new Map<string, ArticleMeta>();
  for (const article of localArticles) {
    mergedBySlug.set(article.slug, article);
  }
  for (const article of remoteArticles) {
    mergedBySlug.set(article.slug, article);
  }

  return Array.from(mergedBySlug.values())
    .filter((article) => isPublishedNow(article.publishedAt))
    .sort((a, b) => {
      const timeA = parsePublishedTimestamp(a.publishedAt) || 0;
      const timeB = parsePublishedTimestamp(b.publishedAt) || 0;
      return timeB - timeA;
    });
}

export async function getArticleBySlug(
  slug: string
): Promise<{ meta: ArticleMeta; content: string } | null> {
  const normalizedSlug = slug.trim();
  if (
    !normalizedSlug ||
    normalizedSlug.includes("/") ||
    normalizedSlug.includes("\\")
  ) {
    return null;
  }

  const remoteArticle = await fetchPublishedSupabaseArticleBySlug(normalizedSlug);
  if (remoteArticle) {
    return isPublishedNow(remoteArticle.meta.publishedAt) ? remoteArticle : null;
  }

  const localArticle = readLocalArticleBySlug(normalizedSlug);
  if (!localArticle) {
    return null;
  }

  return isPublishedNow(localArticle.meta.publishedAt) ? localArticle : null;
}

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";
import { getAllArticles } from "@/lib/articles";
import {
  sendWeeklyNewsletterToSubscribers,
  type NewsletterArticleSummary,
} from "@/lib/newsletter-emails";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { notifyAdminSafe } from "@/lib/resend";
import {
  ANTI_AI_SYSTEM_PROMPT,
  sanitizeAntiAiTypography,
} from "@/lib/anti-ai-guide";
import { EDITORIAL_TOPIC_QUEUE } from "@/data/editorial-schedule";
import type { ArticleCategory } from "@/lib/types";

export const runtime = "nodejs";

const VALID_CATEGORIES: ArticleCategory[] = [
  "Sinais de Abuso",
  "Reconstrução",
  "Paternidade e Família",
  "Saúde Mental",
];

function safeEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a, "utf8").digest();
  const hashB = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return false;
  }

  const provided = authHeader.slice("Bearer ".length).trim();
  if (!provided) {
    return false;
  }

  return safeEqual(provided, secret);
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 200));
  return `${minutes} min de leitura`;
}

interface GeneratedArticleJson {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: ArticleCategory;
  tags?: string[];
  read_time?: string;
  content?: string;
}

export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const nowMs = Date.now();
  const nowIso = new Date(nowMs).toISOString();
  const supabase = getSupabaseAdminClient();

  // Step A: Publish any due scheduled articles in Supabase
  if (supabase) {
    const { data: dueArticles, error: dueError } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, category, read_time")
      .eq("status", "scheduled")
      .lte("published_at", nowIso);

    if (!dueError && dueArticles && dueArticles.length > 0) {
      const ids = dueArticles.map((a) => a.id as string);
      const titles = dueArticles.map((a) => a.title as string);
      const summaries: NewsletterArticleSummary[] = dueArticles.map((a) => ({
        title: String(a.title),
        slug: String(a.slug),
        excerpt: String(a.excerpt ?? ""),
        category: String(a.category ?? "Saúde Mental"),
        readTime: a.read_time ? String(a.read_time) : undefined,
      }));

      const { error: updateError } = await supabase
        .from("articles")
        .update({ status: "published", updated_at: nowIso })
        .in("id", ids);

      if (updateError) {
        return NextResponse.json(
          { error: "Erro ao publicar artigos agendados." },
          { status: 500 }
        );
      }

      revalidatePath("/");
      revalidatePath("/artigos");
      revalidatePath("/sitemap.xml");
      revalidatePath("/llms.txt");

      const newsletter = await sendWeeklyNewsletterToSubscribers(summaries);

      await notifyAdminSafe(
        `Publicação semanal automática: ${titles.length} artigo(s) no ar`,
        `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.6;">
            <h2>Artigos agendados publicados</h2>
            <p>Os seguintes artigos agendados entraram no ar automaticamente:</p>
            <ul>${titles.map((t) => `<li>${t}</li>`).join("")}</ul>
            <p>Newsletter enviada: ${newsletter.sentCount} de ${newsletter.totalSubscribers} assinantes ativos.</p>
          </div>
        `
      );

      return NextResponse.json(
        {
          ok: true,
          action: "published_scheduled",
          count: titles.length,
          titles,
          newsletter,
        },
        { status: 200 }
      );
    }
  }

  // Step B: Check if a pre-written weekly MDX article just became due in the last 24 hours
  const publishedArticles = await getAllArticles();
  const twentyFourHoursAgo = nowMs - 24 * 60 * 60 * 1000;
  const newlyDueMdx = publishedArticles.filter((article) => {
    const ts = new Date(article.publishedAt).getTime();
    return Number.isFinite(ts) && ts > twentyFourHoursAgo && ts <= nowMs;
  });

  if (newlyDueMdx.length > 0) {
    revalidatePath("/");
    revalidatePath("/artigos");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms.txt");

    const summaries: NewsletterArticleSummary[] = newlyDueMdx.map((a) => ({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      category: a.category,
      readTime: a.readTime,
    }));

    const newsletter = await sendWeeklyNewsletterToSubscribers(summaries);

    await notifyAdminSafe(
      `Artigo semanal da série no ar: ${summaries[0].title}`,
      `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.6;">
          <h2>Artigo semanal liberado automaticamente</h2>
          <p><strong>Título:</strong> ${summaries[0].title}</p>
          <p><strong>Categoria:</strong> ${summaries[0].category}</p>
          <p>Newsletter enviada: ${newsletter.sentCount} de ${newsletter.totalSubscribers} assinantes ativos.</p>
        </div>
      `
    );

    return NextResponse.json(
      {
        ok: true,
        action: "published_scheduled_mdx",
        count: summaries.length,
        titles: summaries.map((s) => s.title),
        newsletter,
      },
      { status: 200 }
    );
  }

  // Step C: If no scheduled DB or MDX article is due today and Gemini is configured, generate next queued topic
  if (supabase) {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    if (geminiKey && EDITORIAL_TOPIC_QUEUE.length > 0) {
      const { data: existingRows } = await supabase
        .from("articles")
        .select("slug, title");

      const existingSlugs = new Set(
        (existingRows ?? []).map((row) => String(row.slug ?? "").toLowerCase())
      );
      const existingTitles = new Set(
        (existingRows ?? []).map((row) =>
          String(row.title ?? "").trim().toLowerCase()
        )
      );

      const nextTopic = EDITORIAL_TOPIC_QUEUE.find((topic) => {
        const expectedSlug = slugify(topic.title);
        return (
          !existingSlugs.has(expectedSlug) &&
          !existingTitles.has(topic.title.trim().toLowerCase())
        );
      });

      if (nextTopic) {
        try {
          const ai = new GoogleGenAI({ apiKey: geminiKey });
          const systemInstruction = `Você é redator editorial do portal Homem Abusado (Brasil), voltado a homens que vivem ou viveram relacionamentos abusivos.
Tom calmo, direto, empático e humano. Estruture o artigo em Markdown com H2 e H3, entre 600 e 850 palavras. Sem diagnósticos clínicos nem conselhos jurídicos definitivos.

${ANTI_AI_SYSTEM_PROMPT}

Retorne APENAS JSON válido com as chaves:
{ "title": string, "slug": string, "excerpt": string, "category": "Sinais de Abuso" | "Reconstrução" | "Paternidade e Família" | "Saúde Mental", "tags": string[], "read_time": string, "content": string }`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Título sugerido: ${nextTopic.title}\nCategoria: ${nextTopic.category}\nPauta: ${nextTopic.prompt}`,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              temperature: 0.65,
              maxOutputTokens: 2400,
            },
          });

          const raw = response.text?.trim();
          if (raw) {
            const parsed = JSON.parse(raw) as GeneratedArticleJson;
            const title = sanitizeAntiAiTypography(
              parsed.title?.trim() || nextTopic.title
            );
            const content = sanitizeAntiAiTypography(
              parsed.content?.trim() || ""
            );
            const excerpt = sanitizeAntiAiTypography(
              parsed.excerpt?.trim() || title
            );

            if (content.length >= 300) {
              const slug =
                slugify(parsed.slug?.trim() || title) ||
                `artigo-${Date.now()}`;
              const category: ArticleCategory =
                parsed.category && VALID_CATEGORIES.includes(parsed.category)
                  ? parsed.category
                  : nextTopic.category;
              const tags = Array.isArray(parsed.tags)
                ? parsed.tags
                    .map((t) =>
                      typeof t === "string"
                        ? sanitizeAntiAiTypography(t.trim())
                        : ""
                    )
                    .filter(Boolean)
                    .slice(0, 6)
                : ["acolhimento", "saúde emocional"];

              const { error: insertError } = await supabase
                .from("articles")
                .insert({
                  slug,
                  title,
                  excerpt,
                  category,
                  content,
                  cover_image: nextTopic.coverImage || "/images/pillar-info.png",
                  tags,
                  read_time: parsed.read_time?.trim() || estimateReadTime(content),
                  author_name: "Equipe Homem Abusado",
                  source: "admin",
                  status: "published",
                  published_at: nowIso,
                  updated_at: nowIso,
                });

              if (!insertError) {
                const readTime =
                  parsed.read_time?.trim() || estimateReadTime(content);
                revalidatePath("/");
                revalidatePath("/artigos");
                revalidatePath("/sitemap.xml");
                revalidatePath("/llms.txt");

                const newsletter = await sendWeeklyNewsletterToSubscribers([
                  {
                    title,
                    slug,
                    excerpt,
                    category,
                    readTime,
                  },
                ]);

                await notifyAdminSafe(
                  `Novo artigo semanal publicado automaticamente: ${title}`,
                  `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.6;">
                      <h2>Publicação semanal gerada e publicada</h2>
                      <p><strong>Título:</strong> ${title}</p>
                      <p><strong>Categoria:</strong> ${category}</p>
                      <p><strong>Slug:</strong> /artigos/${slug}</p>
                      <p>Newsletter enviada: ${newsletter.sentCount} de ${newsletter.totalSubscribers} assinantes ativos.</p>
                      <p>Você pode revisar ou editar o texto quando quiser no painel /admin.</p>
                    </div>
                  `
                );

                return NextResponse.json(
                  {
                    ok: true,
                    action: "generated_and_published",
                    title,
                    slug,
                    newsletter,
                  },
                  { status: 200 }
                );
              }
            }
          }
        } catch {
          // Fall through to Step C revalidation if generation fails
        }
      }
    }
  }

  // Step C: Always revalidate Home and Articles so newly due local MDX files go live
  revalidatePath("/");
  revalidatePath("/artigos");

  return NextResponse.json(
    { ok: true, action: "revalidated_mdx" },
    { status: 200 }
  );
}

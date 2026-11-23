import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";
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

  const nowIso = new Date().toISOString();
  const supabase = getSupabaseAdminClient();

  // Step A: Publish any due scheduled articles in Supabase
  if (supabase) {
    const { data: dueArticles, error: dueError } = await supabase
      .from("articles")
      .select("id, title, slug")
      .eq("status", "scheduled")
      .lte("published_at", nowIso);

    if (!dueError && dueArticles && dueArticles.length > 0) {
      const ids = dueArticles.map((a) => a.id as string);
      const titles = dueArticles.map((a) => a.title as string);

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

      await notifyAdminSafe(
        `Publicação semanal automática: ${titles.length} artigo(s) no ar`,
        `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.6;">
            <h2>Artigos agendados publicados</h2>
            <p>Os seguintes artigos agendados entraram no ar automaticamente:</p>
            <ul>${titles.map((t) => `<li>${t}</li>`).join("")}</ul>
          </div>
        `
      );

      return NextResponse.json(
        {
          ok: true,
          action: "published_scheduled",
          count: titles.length,
          titles,
        },
        { status: 200 }
      );
    }

    // Step B: If no scheduled DB articles are due and Gemini is configured, generate next queued topic
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
                revalidatePath("/");
                revalidatePath("/artigos");

                await notifyAdminSafe(
                  `Novo artigo semanal publicado automaticamente: ${title}`,
                  `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.6;">
                      <h2>Publicação semanal gerada e publicada</h2>
                      <p><strong>Título:</strong> ${title}</p>
                      <p><strong>Categoria:</strong> ${category}</p>
                      <p><strong>Slug:</strong> /artigos/${slug}</p>
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

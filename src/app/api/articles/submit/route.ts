import { NextResponse } from "next/server";
import { moderateCommunityText } from "@/lib/moderation";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getSupabaseClient } from "@/lib/supabase";
import { notifyAdminSafe } from "@/lib/resend";
import type { ArticleCategory } from "@/lib/types";

export const runtime = "nodejs";

const VALID_CATEGORIES: ArticleCategory[] = [
  "Sinais de Abuso",
  "Reconstrução",
  "Paternidade e Família",
  "Saúde Mental",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface SubmitArticleBody {
  author_name?: string;
  author_email?: string;
  author_credentials?: string;
  author_bio?: string;
  title?: string;
  category?: ArticleCategory;
  excerpt?: string;
  content?: string;
  tags?: string[] | string;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 200));
  return `${minutes} min de leitura`;
}

function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
      .slice(0, 8);
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  }
  return [];
}

function pickDefaultCover(category: ArticleCategory): string {
  switch (category) {
    case "Sinais de Abuso":
      return "/images/article-gaslighting.png";
    case "Reconstrução":
      return "/images/article-reconstrucao.png";
    case "Paternidade e Família":
      return "/images/article-paternidade.png";
    default:
      return "/images/pillar-info.png";
  }
}

export async function POST(request: Request) {
  const rate = checkRateLimit(request, {
    keyPrefix: "article-submit",
    limit: 5,
    windowMs: 30 * 60 * 1000,
  });
  if (!rate.allowed) {
    return createRateLimitResponse(rate.retryAfterSeconds);
  }

  let body: SubmitArticleBody;
  try {
    body = (await request.json()) as SubmitArticleBody;
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const authorName =
    typeof body.author_name === "string" ? body.author_name.trim() : "";
  const authorEmail =
    typeof body.author_email === "string"
      ? body.author_email.trim().toLowerCase()
      : "";
  const authorCredentials =
    typeof body.author_credentials === "string"
      ? body.author_credentials.trim()
      : "";
  const authorBio =
    typeof body.author_bio === "string" ? body.author_bio.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const category = body.category;

  if (authorName.length < 3) {
    return NextResponse.json(
      { error: "Informe seu nome completo ou nome profissional." },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(authorEmail)) {
    return NextResponse.json(
      { error: "Informe um endereço de e-mail válido para contato editorial." },
      { status: 400 }
    );
  }

  if (authorCredentials.length < 3) {
    return NextResponse.json(
      {
        error:
          "Informe sua qualificação ou registro profissional (por exemplo, CRP, OAB, CRM ou titulação acadêmica).",
      },
      { status: 400 }
    );
  }

  if (authorBio.length < 15) {
    return NextResponse.json(
      { error: "Escreva uma breve apresentação profissional (mínimo de 15 caracteres)." },
      { status: 400 }
    );
  }

  if (title.length < 8) {
    return NextResponse.json(
      { error: "Informe um título claro para o artigo." },
      { status: 400 }
    );
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "Selecione uma categoria válida." },
      { status: 400 }
    );
  }

  if (excerpt.length < 20) {
    return NextResponse.json(
      { error: "Escreva um resumo breve do artigo (mínimo de 20 caracteres)." },
      { status: 400 }
    );
  }

  if (content.length < 300) {
    return NextResponse.json(
      {
        error:
          "O texto do artigo precisa ter pelo menos 300 caracteres para análise editorial.",
      },
      { status: 400 }
    );
  }

  const moderation = await moderateCommunityText(
    `${title}\n${excerpt}\n${content}`
  );
  if (!moderation.allowed) {
    return NextResponse.json(
      {
        error:
          moderation.userMessage ??
          "O texto não pôde ser enviado pelas regras editoriais de segurança e privacidade.",
        isCrisis: moderation.isCrisis,
        flag: moderation.flag,
      },
      { status: moderation.isCrisis ? 422 : 400 }
    );
  }

  const baseSlug = slugify(title) || `artigo-${Date.now()}`;
  const tags = normalizeTags(body.tags);
  const readTime = estimateReadTime(content);
  const coverImage = pickDefaultCover(category);

  const supabase = getSupabaseAdminClient() ?? getSupabaseClient();
  let storedInSupabase = false;

  if (supabase) {
    const insertRow = async (slugToUse: string) =>
      supabase.from("articles").insert({
        slug: slugToUse,
        title,
        excerpt,
        category,
        content,
        cover_image: coverImage,
        tags,
        read_time: readTime,
        author_name: authorName,
        author_credentials: authorCredentials,
        author_bio: authorBio,
        author_email: authorEmail,
        source: "contributor",
        status: "pending_review",
      });

    let { error } = await insertRow(baseSlug);
    if (error && error.code === "23505") {
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
      ({ error } = await insertRow(uniqueSlug));
    }

    if (error) {
      return NextResponse.json(
        {
          error:
            "Não foi possível registrar seu artigo agora. Tente novamente em instantes.",
        },
        { status: 500 }
      );
    }

    storedInSupabase = true;
  }

  await notifyAdminSafe(
    `Novo artigo enviado por colaborador: ${title}`,
    `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.6;">
        <h2>Novo artigo na fila editorial</h2>
        <p><strong>Título:</strong> ${title}</p>
        <p><strong>Categoria:</strong> ${category}</p>
        <p><strong>Autor:</strong> ${authorName} (${authorCredentials})</p>
        <p><strong>E-mail editorial:</strong> ${authorEmail}</p>
        <p><strong>Resumo:</strong> ${excerpt}</p>
        <p>Acesse o painel /admin para revisar, editar ou publicar.</p>
      </div>
    `
  );

  return NextResponse.json(
    {
      ok: true,
      preview: !storedInSupabase,
      message:
        "Artigo recebido com sucesso. Nossa equipe editorial vai revisar o texto e as credenciais antes da publicação.",
    },
    { status: 201 }
  );
}

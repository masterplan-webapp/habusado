import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getScheduledMdxArticles } from "@/lib/articles";
import type {
  ArticleCategory,
  ArticleRecord,
  ArticleStatus,
} from "@/lib/types";

export const runtime = "nodejs";

const VALID_CATEGORIES: ArticleCategory[] = [
  "Sinais de Abuso",
  "Reconstrução",
  "Paternidade e Família",
  "Saúde Mental",
];

const VALID_STATUSES: ArticleStatus[] = [
  "draft",
  "pending_review",
  "scheduled",
  "published",
  "rejected",
];

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
  const minutes = Math.max(2, Math.ceil(words / 200));
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

function buildPreviewArticles(): ArticleRecord[] {
  const now = Date.now();
  return [
    {
      id: "preview-art-contributor-1",
      slug: "como-identificar-inversao-de-culpa-nas-discussoes",
      title: "Como identificar a inversão de culpa nas discussões do dia a dia",
      excerpt:
        "Entenda como conversas legítimas sobre limites acabam invertidas e o que fazer para manter a clareza emocional.",
      category: "Sinais de Abuso",
      content: `## Quando o assunto muda de lugar

Você tenta conversar sobre uma atitude que te machucou e, dez minutos depois, está pedindo desculpas pelo tom da sua voz. Esse deslocamento constante tem nome na literatura psicológica: inversão de culpa.

## Sinais práticos na rotina

- Toda tentativa de diálogo termina com você se defendendo de acusações antigas.
- Sua reação cansada passa a ser tratada como o único problema da relação.
- Você começa a evitar conversas importantes para não iniciar um novo ciclo de desgaste.

## Como recuperar clareza

Anote os fatos objetivos logo após a discussão, converse com uma pessoa de confiança fora da relação e busque acompanhamento psicológico quando sentir que está duvidando da própria memória.`,
      cover_image: "/images/article-gaslighting.png",
      tags: ["limites", "gaslighting", "comunicação"],
      read_time: "4 min de leitura",
      author_name: "Dr. Marcelo Antunes",
      author_credentials: "CRP 06/114892",
      author_bio:
        "Psicólogo clínico com 12 anos de experiência no atendimento de adultos em dinâmicas relacionais abusivas.",
      author_email: "marcelo.antunes@exemplo.org",
      source: "contributor",
      status: "pending_review",
      published_at: null,
      created_at: new Date(now - 1000 * 60 * 90).toISOString(),
      updated_at: new Date(now - 1000 * 60 * 90).toISOString(),
    },
    {
      id: "preview-art-admin-1",
      slug: "primeiros-passos-apos-decidir-encerrar-uma-relacao-abusiva",
      title: "Primeiros passos práticos após decidir encerrar uma relação abusiva",
      excerpt:
        "Um roteiro calmo de organização financeira, rede de apoio e cuidado com a saúde mental nas primeiras semanas.",
      category: "Reconstrução",
      content: `## Organizar antes de anunciar

Sair de uma relação abusiva exige planejamento sereno. Reunir documentos pessoais, revisar acessos digitais e avisar um amigo ou familiar de confiança reduz a exposição a crises súbitas.

## Cuidar do corpo e da rotina

Nas primeiras semanas, o cansaço acumulado costuma aparecer com mais força. Priorize sono regular, alimentação simples e acompanhamento terapêutico para atravessar a transição com estabilidade.`,
      cover_image: "/images/article-reconstrucao.png",
      tags: ["reconstrução", "plano de segurança", "autonomia"],
      read_time: "3 min de leitura",
      author_name: "Equipe Homem Abusado",
      author_credentials: null,
      author_bio: null,
      author_email: null,
      source: "admin",
      status: "draft",
      published_at: null,
      created_at: new Date(now - 1000 * 60 * 300).toISOString(),
      updated_at: new Date(now - 1000 * 60 * 300).toISOString(),
    },
  ];
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const scheduledMdx = getScheduledMdxArticles();
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { mode: "preview", articles: buildPreviewArticles(), scheduledMdx },
      { status: 200 }
    );
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Erro ao consultar artigos no Supabase." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      mode: "supabase",
      articles: (data ?? []) as ArticleRecord[],
      scheduledMdx,
    },
    { status: 200 }
  );
}

interface CreateArticleBody {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: ArticleCategory;
  content?: string;
  cover_image?: string;
  tags?: string[] | string;
  read_time?: string;
  author_name?: string;
  author_credentials?: string | null;
  author_bio?: string | null;
  status?: "draft" | "scheduled" | "published";
  published_at?: string | null;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: CreateArticleBody;
  try {
    body = (await request.json()) as CreateArticleBody;
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const category = body.category;

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { error: "Preencha título, resumo e conteúdo do artigo." },
      { status: 400 }
    );
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "Selecione uma categoria válida." },
      { status: 400 }
    );
  }

  const rawSlug =
    typeof body.slug === "string" && body.slug.trim() ? body.slug : title;
  const slug = slugify(rawSlug) || `artigo-${Date.now()}`;
  const status: ArticleStatus =
    body.status === "published"
      ? "published"
      : body.status === "scheduled"
        ? "scheduled"
        : "draft";
  const nowIso = new Date().toISOString();

  let publishedAt: string | null = null;
  if (status === "published") {
    publishedAt = nowIso;
  } else if (status === "scheduled") {
    const rawDate =
      typeof body.published_at === "string" ? body.published_at.trim() : "";
    const parsedDate = rawDate ? new Date(rawDate) : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Informe uma data e hora válidas para agendar a publicação." },
        { status: 400 }
      );
    }
    publishedAt = parsedDate.toISOString();
  }

  const recordPayload = {
    slug,
    title,
    excerpt,
    category,
    content,
    cover_image:
      typeof body.cover_image === "string" && body.cover_image.trim()
        ? body.cover_image.trim()
        : "/images/pillar-info.png",
    tags: normalizeTags(body.tags),
    read_time:
      typeof body.read_time === "string" && body.read_time.trim()
        ? body.read_time.trim()
        : estimateReadTime(content),
    author_name:
      typeof body.author_name === "string" && body.author_name.trim()
        ? body.author_name.trim()
        : "Equipe Homem Abusado",
    author_credentials:
      typeof body.author_credentials === "string" &&
      body.author_credentials.trim()
        ? body.author_credentials.trim()
        : null,
    author_bio:
      typeof body.author_bio === "string" && body.author_bio.trim()
        ? body.author_bio.trim()
        : null,
    source: "admin" as const,
    status,
    published_at: publishedAt,
    updated_at: nowIso,
  };

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    const previewArticle: ArticleRecord = {
      id: `preview-art-${Date.now()}`,
      ...recordPayload,
      author_email: null,
      created_at: nowIso,
    };
    return NextResponse.json(
      { ok: true, article: previewArticle, preview: true },
      { status: 201 }
    );
  }

  const { data, error } = await supabase
    .from("articles")
    .insert(recordPayload)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Já existe um artigo com este slug. Escolha outro slug." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Não foi possível salvar o artigo no Supabase." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, article: data as ArticleRecord },
    { status: 201 }
  );
}

interface UpdateArticleBody
  extends Omit<Partial<CreateArticleBody>, "status"> {
  id?: string;
  status?: ArticleStatus;
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: UpdateArticleBody;
  try {
    body = (await request.json()) as UpdateArticleBody;
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json(
      { error: "Informe o identificador do artigo." },
      { status: 400 }
    );
  }

  const nowIso = new Date().toISOString();
  const updates: Record<string, unknown> = { updated_at: nowIso };

  if (typeof body.title === "string" && body.title.trim()) {
    updates.title = body.title.trim();
  }
  if (typeof body.slug === "string" && body.slug.trim()) {
    updates.slug = slugify(body.slug);
  }
  if (typeof body.excerpt === "string" && body.excerpt.trim()) {
    updates.excerpt = body.excerpt.trim();
  }
  if (body.category && VALID_CATEGORIES.includes(body.category)) {
    updates.category = body.category;
  }
  if (typeof body.content === "string" && body.content.trim()) {
    updates.content = body.content.trim();
    if (!body.read_time) {
      updates.read_time = estimateReadTime(body.content);
    }
  }
  if (typeof body.cover_image === "string" && body.cover_image.trim()) {
    updates.cover_image = body.cover_image.trim();
  }
  if (body.tags !== undefined) {
    updates.tags = normalizeTags(body.tags);
  }
  if (typeof body.read_time === "string" && body.read_time.trim()) {
    updates.read_time = body.read_time.trim();
  }
  if (typeof body.author_name === "string" && body.author_name.trim()) {
    updates.author_name = body.author_name.trim();
  }
  if (body.author_credentials !== undefined) {
    updates.author_credentials =
      typeof body.author_credentials === "string" &&
      body.author_credentials.trim()
        ? body.author_credentials.trim()
        : null;
  }
  if (body.author_bio !== undefined) {
    updates.author_bio =
      typeof body.author_bio === "string" && body.author_bio.trim()
        ? body.author_bio.trim()
        : null;
  }
  if (body.published_at !== undefined) {
    if (typeof body.published_at === "string" && body.published_at.trim()) {
      const parsedDate = new Date(body.published_at.trim());
      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Data de agendamento inválida." },
          { status: 400 }
        );
      }
      updates.published_at = parsedDate.toISOString();
    } else if (body.published_at === null) {
      updates.published_at = null;
    }
  }
  if (body.status && VALID_STATUSES.includes(body.status)) {
    updates.status = body.status;
    if (body.status === "published" && !updates.published_at) {
      updates.published_at = nowIso;
    }
    if (body.status === "scheduled" && !updates.published_at) {
      return NextResponse.json(
        { error: "Informe uma data e hora válidas para agendar a publicação." },
        { status: 400 }
      );
    }
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: true, article: { id, ...updates }, preview: true },
      { status: 200 }
    );
  }

  const { data, error } = await supabase
    .from("articles")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Já existe outro artigo com este slug." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Não foi possível atualizar o artigo." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, article: data as ArticleRecord },
    { status: 200 }
  );
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id")?.trim() ?? "";

  if (!id) {
    try {
      const body = (await request.json()) as { id?: unknown };
      if (typeof body.id === "string") {
        id = body.id.trim();
      }
    } catch {
      // Ignore empty body when id is missing
    }
  }

  if (!id) {
    return NextResponse.json(
      { error: "Informe o identificador do artigo para excluir." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, preview: true }, { status: 200 });
  }

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      { error: "Não foi possível excluir o artigo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

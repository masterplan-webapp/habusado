"use client";

import * as React from "react";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  Eye,
  FileEdit,
  Mail,
  PenLine,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import type {
  ArticleCategory,
  ArticleMeta,
  ArticleRecord,
  ArticleStatus,
} from "@/lib/types";
import { cn, formatDatePtBr } from "@/lib/utils";

const CATEGORIES: ArticleCategory[] = [
  "Sinais de Abuso",
  "Reconstrução",
  "Paternidade e Família",
  "Saúde Mental",
];

const CURATED_COVERS = [
  { label: "Gaslighting / Reflexão", value: "/images/article-gaslighting.png" },
  { label: "Reconstrução / Caminho", value: "/images/article-reconstrucao.png" },
  { label: "Paternidade / Família", value: "/images/article-paternidade.png" },
  { label: "Informação / Saúde Mental", value: "/images/pillar-info.png" },
  { label: "Horizonte / Manifesto", value: "/images/about-horizon.png" },
];

const ARTICLE_STATUS_FILTERS: Array<{ status: ArticleStatus; label: string }> =
  [
    { status: "pending_review", label: "Enviados por colaboradores" },
    { status: "scheduled", label: "Agendados" },
    { status: "draft", label: "Rascunhos" },
    { status: "published", label: "Publicados" },
    { status: "rejected", label: "Rejeitados" },
  ];

const STATUS_BADGE_LABELS: Record<ArticleStatus, string> = {
  pending_review: "Em revisão",
  scheduled: "Agendado",
  draft: "Rascunho",
  published: "Publicado",
  rejected: "Rejeitado",
};

function getNextTuesday10amInputValue(): string {
  const now = new Date();
  const target = new Date(now.getTime());
  const day = target.getDay(); // 0=Sun, 2=Tue
  let daysUntilTuesday = (2 - day + 7) % 7;
  if (daysUntilTuesday === 0 && target.getHours() >= 10) {
    daysUntilTuesday = 7;
  }
  target.setDate(target.getDate() + daysUntilTuesday);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const date = String(target.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}T10:00`;
}

function toBrtDateTimeInputValue(isoString?: string | null): string {
  if (!isoString) return getNextTuesday10amInputValue();
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return getNextTuesday10amInputValue();
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function formatScheduledBrt(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
  return `${formattedDate} às ${formattedTime}`;
}

function toBrtIsoTimestamp(localDateTimeValue: string): string | null {
  const trimmed = localDateTimeValue.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    return null;
  }
  return `${trimmed}:00-03:00`;
}

function slugifyTitle(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function SimpleMarkdownPreview({ content }: { content: string }) {
  const trimmed = content.trim();
  if (!trimmed) {
    return (
      <p className="text-sm text-[#94A3B8]">
        Escreva o conteúdo em Markdown para visualizar a formatação aqui.
      </p>
    );
  }

  const blocks = trimmed.split(/\n{2,}/);

  return (
    <div className="space-y-4 text-sm leading-[1.7] text-[#CBD5E1]">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trimEnd());
        const first = lines[0]?.trim() ?? "";

        if (first.startsWith("### ")) {
          return (
            <h4 key={index} className="text-base font-semibold text-white">
              {renderInlineBold(first.slice(4))}
            </h4>
          );
        }

        if (first.startsWith("## ")) {
          return (
            <h3 key={index} className="text-lg font-semibold text-white">
              {renderInlineBold(first.slice(3))}
            </h3>
          );
        }

        if (first.startsWith("# ")) {
          return (
            <h2 key={index} className="text-xl font-semibold text-white">
              {renderInlineBold(first.slice(2))}
            </h2>
          );
        }

        if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
          return (
            <ul key={index} className="list-disc space-y-1.5 pl-5">
              {lines.map((line, i) => (
                <li key={i}>{renderInlineBold(line.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
          return (
            <ol key={index} className="list-decimal space-y-1.5 pl-5">
              {lines.map((line, i) => (
                <li key={i}>
                  {renderInlineBold(line.trim().replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        if (first.startsWith("> ")) {
          const quoteText = lines
            .map((line) => line.trim().replace(/^>\s?/, ""))
            .join(" ");
          return (
            <blockquote
              key={index}
              className="rounded-lg border-l-2 border-[#2DD4BF] bg-[#021729] px-4 py-3 text-[#E2E8F0]"
            >
              {renderInlineBold(quoteText)}
            </blockquote>
          );
        }

        return (
          <p key={index} className="whitespace-pre-line">
            {renderInlineBold(block)}
          </p>
        );
      })}
    </div>
  );
}

interface AdminArticlesTabProps {
  articles: ArticleRecord[];
  loading: boolean;
  onArticlesChange: React.Dispatch<React.SetStateAction<ArticleRecord[]>>;
}

export function AdminArticlesTab({
  articles,
  loading,
  onArticlesChange,
}: AdminArticlesTabProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Weekly schedule state (from GET /api/admin/articles -> scheduledMdx)
  const [scheduledMdx, setScheduledMdx] = React.useState<ArticleMeta[]>([]);
  const [loadingSchedule, setLoadingSchedule] = React.useState(true);

  // Bloco 1: AI Generator state
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [aiCategory, setAiCategory] = React.useState<ArticleCategory | "">("");
  const [generating, setGenerating] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [aiNotice, setAiNotice] = React.useState<string | null>(null);

  // Bloco 2: Editor state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [category, setCategory] =
    React.useState<ArticleCategory>("Sinais de Abuso");
  const [coverImage, setCoverImage] = React.useState(
    "/images/article-gaslighting.png"
  );
  const [customCover, setCustomCover] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");
  const [authorName, setAuthorName] = React.useState("Equipe Homem Abusado");
  const [authorCredentials, setAuthorCredentials] = React.useState("");
  const [authorBio, setAuthorBio] = React.useState("");
  const [scheduledAt, setScheduledAt] = React.useState("");
  const [content, setContent] = React.useState("");
  const [editorMode, setEditorMode] = React.useState<"write" | "preview">(
    "write"
  );
  const [saving, setSaving] = React.useState(false);
  const [editorError, setEditorError] = React.useState<string | null>(null);
  const [editorFeedback, setEditorFeedback] = React.useState<string | null>(
    null
  );

  // Bloco 3: Queue state
  const [statusFilter, setStatusFilter] =
    React.useState<ArticleStatus>("pending_review");
  const [busyArticleId, setBusyArticleId] = React.useState<string | null>(null);
  const [queueFeedback, setQueueFeedback] = React.useState<string | null>(null);
  const [queueError, setQueueError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setScheduledAt(getNextTuesday10amInputValue());

    let cancelled = false;
    async function loadScheduledMdx() {
      try {
        const response = await fetch("/api/admin/articles", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as {
          scheduledMdx?: ArticleMeta[];
        };
        if (!cancelled && Array.isArray(payload.scheduledMdx)) {
          setScheduledMdx(payload.scheduledMdx);
        }
      } catch {
        // Ignore schedule fetch errors when offline.
      } finally {
        if (!cancelled) {
          setLoadingSchedule(false);
        }
      }
    }

    void loadScheduledMdx();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcomingSchedule = React.useMemo(() => {
    const mdxEntries = scheduledMdx.map((item) => ({
      id: `mdx-${item.slug}`,
      title: item.title,
      category: item.category,
      publishedAt: item.publishedAt,
      sourceLabel: "Série MDX" as const,
    }));

    const panelEntries = articles
      .filter(
        (article) =>
          article.status === "scheduled" && Boolean(article.published_at)
      )
      .map((article) => ({
        id: `panel-${article.id}`,
        title: article.title,
        category: article.category,
        publishedAt: article.published_at as string,
        sourceLabel: "Agendado no painel" as const,
      }));

    return [...mdxEntries, ...panelEntries].sort(
      (a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
  }, [scheduledMdx, articles]);

  function resetEditor() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setSlugManuallyEdited(false);
    setCategory("Sinais de Abuso");
    setCoverImage("/images/article-gaslighting.png");
    setCustomCover("");
    setExcerpt("");
    setTagsInput("");
    setAuthorName("Equipe Homem Abusado");
    setAuthorCredentials("");
    setAuthorBio("");
    setScheduledAt(getNextTuesday10amInputValue());
    setContent("");
    setEditorMode("write");
    setEditorError(null);
    setEditorFeedback(null);
  }

  function handleTitleChange(nextTitle: string) {
    setTitle(nextTitle);
    if (!editingId && !slugManuallyEdited) {
      setSlug(slugifyTitle(nextTitle));
    }
  }

  function loadArticleIntoEditor(article: ArticleRecord) {
    setEditingId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setSlugManuallyEdited(true);
    setCategory(article.category);

    const isCurated = CURATED_COVERS.some(
      (item) => item.value === article.cover_image
    );
    if (isCurated) {
      setCoverImage(article.cover_image);
      setCustomCover("");
    } else {
      setCoverImage("custom");
      setCustomCover(article.cover_image);
    }

    setExcerpt(article.excerpt);
    setTagsInput((article.tags ?? []).join(", "));
    setAuthorName(article.author_name || "Equipe Homem Abusado");
    setAuthorCredentials(article.author_credentials ?? "");
    setAuthorBio(article.author_bio ?? "");
    setScheduledAt(toBrtDateTimeInputValue(article.published_at));
    setContent(article.content);
    setEditorMode("write");
    setEditorError(null);
    setEditorFeedback(null);

    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleGenerateDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAiError(null);
    setAiNotice(null);

    const trimmedPrompt = aiPrompt.trim();
    if (trimmedPrompt.length < 10) {
      setAiError(
        "Descreva o tema ou prompt do artigo com pelo menos 10 caracteres."
      );
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/admin/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          category: aiCategory || undefined,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        draft?: {
          title: string;
          slug: string;
          excerpt: string;
          category: ArticleCategory;
          tags: string[];
          read_time: string;
          content: string;
        };
        preview?: boolean;
        error?: string;
      };

      if (!response.ok || !data.draft) {
        setAiError(data.error ?? "Não foi possível gerar o rascunho agora.");
        return;
      }

      setEditingId(null);
      setTitle(data.draft.title);
      setSlug(data.draft.slug);
      setSlugManuallyEdited(true);
      setCategory(data.draft.category);
      setExcerpt(data.draft.excerpt);
      setTagsInput((data.draft.tags ?? []).join(", "));
      setContent(data.draft.content);
      setEditorMode("write");
      setEditorError(null);
      setEditorFeedback(null);

      setAiNotice(
        data.preview
          ? "Rascunho gerado em modo local (GEMINI_API_KEY não configurada). Revise e ajuste no editor abaixo."
          : "Rascunho gerado com sucesso. Revise os campos no editor abaixo antes de salvar ou publicar."
      );

      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setAiError("Erro de conexão ao gerar rascunho.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveArticle(
    targetStatus: "draft" | "scheduled" | "published"
  ) {
    setEditorError(null);
    setEditorFeedback(null);

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim() || slugifyTitle(trimmedTitle);
    const trimmedExcerpt = excerpt.trim();
    const trimmedContent = content.trim();
    const resolvedCover =
      coverImage === "custom"
        ? customCover.trim() || "/images/pillar-info.png"
        : coverImage;
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (trimmedTitle.length < 5) {
      setEditorError("Informe um título com pelo menos 5 caracteres.");
      return;
    }
    if (trimmedExcerpt.length < 15) {
      setEditorError("Escreva um resumo com pelo menos 15 caracteres.");
      return;
    }
    if (trimmedContent.length < 80) {
      setEditorError(
        "O conteúdo do artigo precisa ter pelo menos 80 caracteres."
      );
      return;
    }

    let scheduledIso: string | undefined;
    if (targetStatus === "scheduled") {
      const converted = toBrtIsoTimestamp(scheduledAt);
      if (!converted) {
        setEditorError(
          "Escolha uma data e hora válidas no horário de Brasília para agendar."
        );
        return;
      }
      scheduledIso = converted;
    }

    setSaving(true);
    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        title: trimmedTitle,
        slug: trimmedSlug,
        excerpt: trimmedExcerpt,
        category,
        content: trimmedContent,
        cover_image: resolvedCover,
        tags,
        author_name: authorName.trim() || "Equipe Homem Abusado",
        author_credentials: authorCredentials.trim() || null,
        author_bio: authorBio.trim() || null,
        status: targetStatus,
        ...(scheduledIso ? { published_at: scheduledIso } : {}),
      };

      const response = await fetch("/api/admin/articles", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        article?: ArticleRecord;
        error?: string;
      };

      if (!response.ok || !data.article) {
        setEditorError(data.error ?? "Não foi possível salvar o artigo.");
        return;
      }

      const savedArticle = data.article;
      onArticlesChange((prev) => {
        const exists = prev.some((item) => item.id === savedArticle.id);
        if (exists) {
          return prev.map((item) =>
            item.id === savedArticle.id ? savedArticle : item
          );
        }
        return [savedArticle, ...prev];
      });

      setEditingId(savedArticle.id);
      setSlug(savedArticle.slug);
      setStatusFilter(savedArticle.status);
      setEditorFeedback(
        targetStatus === "published"
          ? "Artigo publicado com sucesso."
          : targetStatus === "scheduled" && scheduledIso
            ? `Artigo agendado para ${formatScheduledBrt(scheduledIso)} (Brasília).`
            : "Rascunho salvo com sucesso."
      );
    } catch {
      setEditorError("Erro de conexão ao salvar o artigo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickStatus(
    article: ArticleRecord,
    nextStatus: "published" | "rejected"
  ) {
    setBusyArticleId(article.id);
    setQueueFeedback(null);
    setQueueError(null);

    try {
      const response = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, status: nextStatus }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        article?: ArticleRecord;
        error?: string;
      };

      if (!response.ok) {
        setQueueError(
          data.error ?? "Não foi possível atualizar o status do artigo."
        );
        return;
      }

      onArticlesChange((prev) =>
        prev.map((item) =>
          item.id === article.id
            ? (data.article ?? { ...item, status: nextStatus })
            : item
        )
      );

      setQueueFeedback(
        nextStatus === "published"
          ? `Artigo "${article.title}" publicado.`
          : `Artigo "${article.title}" marcado como rejeitado.`
      );
    } catch {
      setQueueError("Erro de conexão ao atualizar o artigo.");
    } finally {
      setBusyArticleId(null);
    }
  }

  async function handleDeleteArticle(article: ArticleRecord) {
    setBusyArticleId(article.id);
    setQueueFeedback(null);
    setQueueError(null);

    try {
      const response = await fetch("/api/admin/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setQueueError(data.error ?? "Não foi possível excluir o artigo.");
        return;
      }

      onArticlesChange((prev) => prev.filter((item) => item.id !== article.id));
      if (editingId === article.id) {
        resetEditor();
      }
      setQueueFeedback(`Artigo "${article.title}" excluído.`);
    } catch {
      setQueueError("Erro de conexão ao excluir o artigo.");
    } finally {
      setBusyArticleId(null);
    }
  }

  const filteredArticles = React.useMemo(
    () => articles.filter((article) => article.status === statusFilter),
    [articles, statusFilter]
  );

  return (
    <div className="space-y-8">
      {/* Programação Semanal (Terças às 10h, horário de Brasília) */}
      <Card className="border-[#015E57]/60 bg-[#112536] p-6">
        <div className="flex items-start gap-3 border-b border-[#1E3A52] pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#015E57] bg-[#021729] text-[#2DD4BF]">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Programação Semanal (Terças às 10h, horário de Brasília)
            </h2>
            <p className="mt-0.5 text-sm text-[#CBD5E1]">
              Publicação automática todas as terças às 10h (BRT) via cron{" "}
              <code className="rounded-md bg-[#021729] px-1.5 py-0.5 text-xs text-[#2DD4BF]">
                0 13 * * 2
              </code>{" "}
              em <code className="text-xs text-[#2DD4BF]">vercel.json</code>.
            </p>
          </div>
        </div>

        <div className="mt-4">
          {loadingSchedule ? (
            <p className="text-sm text-[#94A3B8]">
              Carregando calendário semanal...
            </p>
          ) : upcomingSchedule.length === 0 ? (
            <p className="text-sm text-[#CBD5E1]">
              Nenhum artigo agendado no momento. Use o editor abaixo para
              agendar novas publicações para as próximas terças às 10h.
            </p>
          ) : (
            <ol className="space-y-2.5">
              {upcomingSchedule.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col gap-2 rounded-lg border border-[#1E3A52] bg-[#021729] p-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#2DD4BF]">
                      {formatScheduledBrt(entry.publishedAt)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {entry.title}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Badge variant="neutral">{entry.category}</Badge>
                    <Badge
                      variant={
                        entry.sourceLabel === "Série MDX" ? "accent" : "neutral"
                      }
                    >
                      {entry.sourceLabel}
                    </Badge>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </Card>

      {/* Bloco 1: Gerar rascunho por prompt (IA) */}
      <Card className="border-[#015E57]/60 bg-[#112536] p-6">
        <div className="flex items-start gap-3 border-b border-[#1E3A52] pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#015E57] bg-[#021729] text-[#2DD4BF]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Gerar rascunho por prompt (IA)
            </h2>
            <p className="mt-0.5 text-sm text-[#CBD5E1]">
              Descreva o tema e o enfoque desejado. O rascunho é preenchido
              direto no editor abaixo para revisão editorial.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateDraft} className="mt-5 space-y-4">
          <Textarea
            label="Tema ou instrução do artigo"
            rows={3}
            placeholder="Ex.: Escreva um artigo sobre como lidar com chantagem emocional envolvendo os filhos e manter a calma nas conversas."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="ai-article-category"
                className="mb-1.5 block text-sm font-medium text-white"
              >
                Categoria opcional
              </label>
              <select
                id="ai-article-category"
                value={aiCategory}
                onChange={(e) =>
                  setAiCategory(e.target.value as ArticleCategory | "")
                }
                className="w-full rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-[#2DD4BF] focus:outline-none"
              >
                <option value="">Escolher automaticamente</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={generating}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {generating ? "Gerando rascunho..." : "Gerar rascunho com IA"}
            </Button>
          </div>

          {aiError && (
            <p
              role="alert"
              className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-4 py-2.5 text-sm text-[#FCA5A5]"
            >
              {aiError}
            </p>
          )}

          {aiNotice && (
            <p
              role="status"
              className="rounded-lg border border-[#015E57] bg-[#015E57]/20 px-4 py-2.5 text-sm text-[#E2E8F0]"
            >
              {aiNotice}
            </p>
          )}
        </form>
      </Card>

      {/* Bloco 2: Editor Simples de Artigo */}
      <div ref={editorRef}>
        <Card className="border-[#1E3A52] bg-[#112536] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E3A52] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">
                  {editingId ? "Editando artigo" : "Novo artigo"}
                </h2>
                {editingId && <Badge variant="accent">Edição ativa</Badge>}
              </div>
              <p className="mt-0.5 text-sm text-[#CBD5E1]">
                Escreva em Markdown simples e salve como rascunho ou publique
                direto no portal.
              </p>
            </div>

            <Button variant="ghost" size="sm" onClick={resetEditor}>
              Limpar / Novo artigo
            </Button>
          </div>

          <div className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Título"
                placeholder="Título claro e direto do artigo"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />

              <Input
                label="Slug (URL)"
                placeholder="exemplo-de-slug-do-artigo"
                value={slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setSlug(e.target.value);
                }}
                hint="Usado em /artigos/seu-slug"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="editor-category"
                  className="text-sm font-medium text-white"
                >
                  Categoria
                </label>
                <select
                  id="editor-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ArticleCategory)
                  }
                  className="w-full rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-[#2DD4BF] focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="editor-cover"
                  className="text-sm font-medium text-white"
                >
                  Imagem de capa
                </label>
                <select
                  id="editor-cover"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-[#2DD4BF] focus:outline-none"
                >
                  {CURATED_COVERS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label} ({item.value})
                    </option>
                  ))}
                  <option value="custom">Caminho ou URL personalizada</option>
                </select>
              </div>
            </div>

            {coverImage === "custom" && (
              <Input
                label="Caminho ou URL da imagem de capa"
                placeholder="/images/pillar-info.png ou https://..."
                value={customCover}
                onChange={(e) => setCustomCover(e.target.value)}
              />
            )}

            <Textarea
              label="Resumo (excerpt)"
              rows={2}
              placeholder="Resumo curto exibido nos cartões e no resultado de busca."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Tags (separadas por vírgula)"
                placeholder="gaslighting, limites, saúde mental"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />

              <Input
                label="Autor"
                placeholder="Equipe Homem Abusado"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />

              <Input
                label="Credenciais do autor (opcional)"
                placeholder="Ex.: Psicólogo Clínico (CRP 06/123456)"
                value={authorCredentials}
                onChange={(e) => setAuthorCredentials(e.target.value)}
              />
            </div>

            {authorCredentials.trim() && (
              <Input
                label="Bio curta do autor (opcional)"
                placeholder="Breve apresentação exibida ao final do artigo."
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
              />
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-white">
                  Conteúdo em Markdown
                </span>
                <div className="inline-flex rounded-lg border border-[#1E3A52] bg-[#021729] p-1">
                  <button
                    type="button"
                    onClick={() => setEditorMode("write")}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                      editorMode === "write"
                        ? "bg-[#015E57] text-white"
                        : "text-[#CBD5E1] hover:text-white"
                    )}
                  >
                    <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                    Escrever
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("preview")}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                      editorMode === "preview"
                        ? "bg-[#015E57] text-white"
                        : "text-[#CBD5E1] hover:text-white"
                    )}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    Pré-visualizar
                  </button>
                </div>
              </div>

              {editorMode === "write" ? (
                <Textarea
                  rows={12}
                  placeholder="## Subtítulo&#10;&#10;Escreva o artigo aqui usando Markdown simples (## para subtítulos, **negrito**, - para listas)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <div className="min-h-[260px] rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] p-5">
                  <SimpleMarkdownPreview content={content} />
                </div>
              )}
            </div>

            {editorError && (
              <p
                role="alert"
                className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-4 py-2.5 text-sm text-[#FCA5A5]"
              >
                {editorError}
              </p>
            )}

            {editorFeedback && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-lg border border-[#015E57] bg-[#015E57]/20 px-4 py-2.5 text-sm text-[#E2E8F0]"
              >
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-[#2DD4BF]"
                  aria-hidden="true"
                />
                <span>{editorFeedback}</span>
              </div>
            )}

            <div className="flex flex-col gap-4 border-t border-[#1E3A52] pt-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full lg:max-w-xs">
                <Input
                  label="Agendar publicação (horário de Brasília)"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  hint="Padrão sugerido: próxima terça às 10h (BRT)."
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  disabled={saving}
                  onClick={() => void handleSaveArticle("draft")}
                >
                  {saving ? "Salvando..." : "Salvar como rascunho"}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  disabled={saving}
                  onClick={() => void handleSaveArticle("scheduled")}
                >
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  {saving ? "Agendando..." : "Agendar publicação"}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={saving}
                  onClick={() => void handleSaveArticle("published")}
                >
                  {saving ? "Publicando..." : "Publicar artigo"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bloco 3: Fila Editorial e Artigos Salvos */}
      <section aria-label="Fila editorial de artigos" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">
            Fila Editorial e Artigos Salvos
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {ARTICLE_STATUS_FILTERS.map((filter) => {
              const count = articles.filter(
                (item) => item.status === filter.status
              ).length;
              return (
                <button
                  key={filter.status}
                  type="button"
                  onClick={() => setStatusFilter(filter.status)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    statusFilter === filter.status
                      ? "border-[#2DD4BF] bg-[#015E57]/35 text-[#2DD4BF]"
                      : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
                  )}
                >
                  <span>{filter.label}</span>
                  <span className="text-[11px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {queueFeedback && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-lg border border-[#015E57] bg-[#015E57]/20 px-4 py-2.5 text-sm text-[#E2E8F0]"
          >
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-[#2DD4BF]"
              aria-hidden="true"
            />
            <span>{queueFeedback}</span>
          </div>
        )}

        {queueError && (
          <p
            role="alert"
            className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-4 py-2.5 text-sm text-[#FCA5A5]"
          >
            {queueError}
          </p>
        )}

        {loading ? (
          <Card className="border-[#1E3A52] bg-[#112536] p-8 text-center text-sm text-[#CBD5E1]">
            Carregando artigos...
          </Card>
        ) : filteredArticles.length === 0 ? (
          <Card className="border-[#1E3A52] bg-[#112536] p-8 text-center text-sm text-[#CBD5E1]">
            Nenhum artigo nesta categoria no momento.
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => {
              const isBusy = busyArticleId === article.id;
              return (
                <Card
                  key={article.id}
                  className="border-[#1E3A52] bg-[#112536] p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E3A52] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          article.source === "contributor"
                            ? "accent"
                            : "neutral"
                        }
                      >
                        {article.source === "contributor"
                          ? "Colaborador"
                          : "Admin"}
                      </Badge>
                      <Badge variant="neutral">{article.category}</Badge>
                      <Badge
                        variant={
                          article.status === "published"
                            ? "accent"
                            : article.status === "rejected"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {STATUS_BADGE_LABELS[article.status]}
                      </Badge>
                    </div>
                    <time
                      dateTime={article.published_at ?? article.created_at}
                      className="text-xs text-[#94A3B8]"
                    >
                      {formatDatePtBr(
                        article.published_at ?? article.created_at
                      )}
                    </time>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                    {article.excerpt}
                  </p>

                  <div className="mt-4 rounded-lg border border-[#1E3A52] bg-[#021729] p-3.5 text-xs text-[#CBD5E1]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        <strong className="text-white">Autor:</strong>{" "}
                        {article.author_name}
                      </span>
                      {article.author_credentials && (
                        <span className="text-[#2DD4BF]">
                          {article.author_credentials}
                        </span>
                      )}
                      {article.author_email && (
                        <a
                          href={`mailto:${article.author_email}`}
                          className="inline-flex items-center gap-1 text-[#CBD5E1] underline underline-offset-4 hover:text-white"
                        >
                          <Mail className="h-3 w-3" aria-hidden="true" />
                          {article.author_email}
                        </a>
                      )}
                    </div>
                    {article.author_bio && (
                      <p className="mt-2 leading-relaxed text-[#94A3B8]">
                        {article.author_bio}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#1E3A52] pt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => loadArticleIntoEditor(article)}
                    >
                      <FileEdit className="h-4 w-4" aria-hidden="true" />
                      Editar no editor
                    </Button>

                    {article.status !== "published" && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isBusy}
                        onClick={() =>
                          void handleQuickStatus(article, "published")
                        }
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Publicar
                      </Button>
                    )}

                    {article.status !== "rejected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isBusy}
                        onClick={() =>
                          void handleQuickStatus(article, "rejected")
                        }
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                        Rejeitar
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => void handleDeleteArticle(article)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Excluir
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

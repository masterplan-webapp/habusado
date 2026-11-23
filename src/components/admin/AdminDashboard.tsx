"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Globe,
  LogOut,
  MapPin,
  RefreshCw,
  ShieldAlert,
  X,
} from "lucide-react";
import { AdminArticlesTab } from "@/components/admin/AdminArticlesTab";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type {
  ArticleRecord,
  Professional,
  ProfessionalStatus,
  Testimonial,
  TestimonialReply,
  TestimonialStatus,
} from "@/lib/types";
import { cn, formatDatePtBr } from "@/lib/utils";

type ModerationReply = TestimonialReply & {
  testimonial_title?: string;
  moderation_flag?: string | null;
};

interface ModerationStats {
  pendingTestimonials: number;
  pendingReplies: number;
  pendingProfessionals: number;
  subscribersCount: number;
}

interface ModerationResponse {
  mode: "supabase" | "preview";
  stats: ModerationStats;
  testimonials: Testimonial[];
  replies: ModerationReply[];
  professionals: Professional[];
}

type ActiveTab = "testimonials" | "replies" | "professionals" | "articles";

const STATUS_LABELS: Record<TestimonialStatus, string> = {
  pending: "Pendentes",
  approved: "Aprovados",
  rejected: "Rejeitados",
};

const PROFESSIONAL_STATUS_LABELS: Record<ProfessionalStatus, string> = {
  pending: "Pendentes",
  approved: "Aprovados",
};

const VERIFICATION_LINKS = [
  { label: "Consultar CFP (CRP)", href: "https://cadastro.cfp.org.br/" },
  { label: "Consultar OAB (CNA)", href: "https://cna.oab.org.br/" },
  {
    label: "Consultar CFM (CRM)",
    href: "https://portal.cfm.org.br/busca-medicos/",
  },
];

export function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = React.useState<ModerationResponse | null>(null);
  const [articles, setArticles] = React.useState<ArticleRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [activeTab, setActiveTab] = React.useState<ActiveTab>("testimonials");
  const [testimonialFilter, setTestimonialFilter] =
    React.useState<TestimonialStatus>("pending");
  const [replyFilter, setReplyFilter] =
    React.useState<TestimonialStatus>("pending");
  const [professionalFilter, setProfessionalFilter] =
    React.useState<ProfessionalStatus>("pending");

  const [busyKey, setBusyKey] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const fetchModerationData = React.useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setLoadError(null);

    try {
      const [modResponse, articlesResponse] = await Promise.all([
        fetch("/api/admin/moderation", { cache: "no-store" }),
        fetch("/api/admin/articles", { cache: "no-store" }),
      ]);

      if (!modResponse.ok) {
        const body = (await modResponse.json().catch(() => ({}))) as {
          error?: string;
        };
        setLoadError(
          body.error ?? "Não foi possível carregar os itens de moderação."
        );
        return;
      }

      const payload = (await modResponse.json()) as ModerationResponse;
      setData(payload);

      if (articlesResponse.ok) {
        const articlesPayload = (await articlesResponse.json()) as {
          articles?: ArticleRecord[];
        };
        if (Array.isArray(articlesPayload.articles)) {
          setArticles(articlesPayload.articles);
        }
      }
    } catch {
      setLoadError("Erro de conexão ao carregar o painel.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchModerationData(false);
  }, [fetchModerationData]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleModerationAction(
    type: "testimonial" | "reply" | "professional",
    id: string,
    action: "approve" | "reject"
  ) {
    const key = `${type}:${id}:${action}`;
    setBusyKey(key);
    setFeedback(null);
    setActionError(null);

    try {
      const response = await fetch("/api/admin/moderation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, action }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        status?: string;
        error?: string;
      };

      if (!response.ok) {
        setActionError(
          result.error ?? "Não foi possível atualizar o status deste item."
        );
        return;
      }

      setData((prev) => {
        if (!prev) return prev;

        if (type === "testimonial") {
          const nextStatus: TestimonialStatus =
            action === "approve" ? "approved" : "rejected";
          const nextTestimonials = prev.testimonials.map((item) =>
            item.id === id ? { ...item, status: nextStatus } : item
          );
          return {
            ...prev,
            testimonials: nextTestimonials,
            stats: {
              ...prev.stats,
              pendingTestimonials: nextTestimonials.filter(
                (item) => item.status === "pending"
              ).length,
            },
          };
        }

        if (type === "reply") {
          const nextStatus: TestimonialStatus =
            action === "approve" ? "approved" : "rejected";
          const nextReplies = prev.replies.map((item) =>
            item.id === id ? { ...item, status: nextStatus } : item
          );
          return {
            ...prev,
            replies: nextReplies,
            stats: {
              ...prev.stats,
              pendingReplies: nextReplies.filter(
                (item) => item.status === "pending"
              ).length,
            },
          };
        }

        const nextProfessionals =
          action === "approve"
            ? prev.professionals.map((item) =>
                item.id === id
                  ? { ...item, status: "approved" as const }
                  : item
              )
            : prev.professionals.filter((item) => item.id !== id);

        return {
          ...prev,
          professionals: nextProfessionals,
          stats: {
            ...prev.stats,
            pendingProfessionals: nextProfessionals.filter(
              (item) => item.status === "pending"
            ).length,
          },
        };
      });

      const labelMap = {
        testimonial: "Relato",
        reply: "Resposta de apoio",
        professional: "Cadastro de profissional",
      };
      setFeedback(
        `${labelMap[type]} ${action === "approve" ? "aprovado" : "rejeitado"} com sucesso.`
      );
    } catch {
      setActionError("Erro de conexão ao salvar a ação de moderação.");
    } finally {
      setBusyKey(null);
    }
  }

  const filteredTestimonials = React.useMemo(
    () =>
      (data?.testimonials ?? []).filter(
        (item) => item.status === testimonialFilter
      ),
    [data?.testimonials, testimonialFilter]
  );

  const filteredReplies = React.useMemo(
    () =>
      (data?.replies ?? []).filter((item) => item.status === replyFilter),
    [data?.replies, replyFilter]
  );

  const filteredProfessionals = React.useMemo(
    () =>
      (data?.professionals ?? []).filter(
        (item) => item.status === professionalFilter
      ),
    [data?.professionals, professionalFilter]
  );

  const pendingArticlesCount = React.useMemo(
    () =>
      articles.filter((article) => article.status === "pending_review").length,
    [articles]
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-[#1E3A52] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Painel de Moderação
            </h1>
            {data && (
              <Badge variant={data.mode === "supabase" ? "accent" : "neutral"}>
                {data.mode === "supabase"
                  ? "Supabase conectado"
                  : "Modo visualização local"}
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm text-[#CBD5E1]">
            Revise envios da comunidade e credenciais profissionais antes da
            publicação.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void fetchModerationData(true)}
            disabled={refreshing || loading}
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
              aria-hidden="true"
            />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {loggingOut ? "Saindo..." : "Sair"}
          </Button>
        </div>
      </header>

      {loadError && (
        <div
          role="alert"
          className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-4 py-3 text-sm text-[#FCA5A5]"
        >
          {loadError}
        </div>
      )}

      {feedback && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-lg border border-[#015E57] bg-[#015E57]/20 px-4 py-3 text-sm text-[#E2E8F0]"
        >
          <CheckCircle2
            className="h-4 w-4 shrink-0 text-[#2DD4BF]"
            aria-hidden="true"
          />
          <span>{feedback}</span>
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-4 py-3 text-sm text-[#FCA5A5]"
        >
          {actionError}
        </div>
      )}

      <section
        aria-label="Resumo da fila de moderação"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <Card className="border-[#1E3A52] bg-[#112536] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
            Relatos pendentes
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "..." : (data?.stats.pendingTestimonials ?? 0)}
          </p>
        </Card>

        <Card className="border-[#1E3A52] bg-[#112536] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
            Respostas pendentes
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "..." : (data?.stats.pendingReplies ?? 0)}
          </p>
        </Card>

        <Card className="border-[#1E3A52] bg-[#112536] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
            Profissionais pendentes
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "..." : (data?.stats.pendingProfessionals ?? 0)}
          </p>
        </Card>

        <Card className="border-[#1E3A52] bg-[#112536] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
            Artigos em revisão
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "..." : pendingArticlesCount}
          </p>
        </Card>

        <Card className="border-[#1E3A52] bg-[#112536] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
            Assinantes newsletter
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#2DD4BF]">
            {loading ? "..." : (data?.stats.subscribersCount ?? 0)}
          </p>
        </Card>
      </section>

      <div
        role="tablist"
        aria-label="Categorias de moderação"
        className="flex flex-wrap gap-2 border-b border-[#1E3A52] pb-4"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "testimonials"}
          onClick={() => setActiveTab("testimonials")}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "testimonials"
              ? "border-[#2DD4BF] bg-[#015E57] text-white"
              : "border-[#1E3A52] bg-[#112536] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
          )}
        >
          <span>Relatos</span>
          <span className="rounded-full bg-[#021729] px-2 py-0.5 text-xs text-[#2DD4BF]">
            {data?.stats.pendingTestimonials ?? 0}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "replies"}
          onClick={() => setActiveTab("replies")}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "replies"
              ? "border-[#2DD4BF] bg-[#015E57] text-white"
              : "border-[#1E3A52] bg-[#112536] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
          )}
        >
          <span>Respostas de Apoio</span>
          <span className="rounded-full bg-[#021729] px-2 py-0.5 text-xs text-[#2DD4BF]">
            {data?.stats.pendingReplies ?? 0}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "professionals"}
          onClick={() => setActiveTab("professionals")}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "professionals"
              ? "border-[#2DD4BF] bg-[#015E57] text-white"
              : "border-[#1E3A52] bg-[#112536] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
          )}
        >
          <span>Profissionais</span>
          <span className="rounded-full bg-[#021729] px-2 py-0.5 text-xs text-[#2DD4BF]">
            {data?.stats.pendingProfessionals ?? 0}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "articles"}
          onClick={() => setActiveTab("articles")}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "articles"
              ? "border-[#2DD4BF] bg-[#015E57] text-white"
              : "border-[#1E3A52] bg-[#112536] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
          )}
        >
          <span>Artigos</span>
          <span className="rounded-full bg-[#021729] px-2 py-0.5 text-xs text-[#2DD4BF]">
            {pendingArticlesCount}
          </span>
        </button>
      </div>

      {loading ? (
        <Card className="border-[#1E3A52] bg-[#112536] p-8 text-center text-sm text-[#CBD5E1]">
          Carregando fila de moderação...
        </Card>
      ) : (
        <>
          {activeTab === "testimonials" && (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {(["pending", "approved", "rejected"] as TestimonialStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setTestimonialFilter(status)}
                      className={cn(
                        "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                        testimonialFilter === status
                          ? "border-[#2DD4BF] bg-[#015E57]/35 text-[#2DD4BF]"
                          : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
                      )}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  )
                )}
              </div>

              {filteredTestimonials.length === 0 ? (
                <Card className="border-[#1E3A52] bg-[#112536] p-8 text-center text-sm text-[#CBD5E1]">
                  Nenhum relato com status{" "}
                  {STATUS_LABELS[testimonialFilter].toLowerCase()}.
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredTestimonials.map((item) => (
                    <Card
                      key={item.id}
                      className="border-[#1E3A52] bg-[#112536] p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E3A52] pb-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-sm font-semibold text-[#2DD4BF]">
                            {item.pseudonym}
                          </span>
                          <Badge
                            variant={
                              item.status === "approved"
                                ? "accent"
                                : item.status === "rejected"
                                  ? "warning"
                                  : "neutral"
                            }
                          >
                            {STATUS_LABELS[item.status]}
                          </Badge>
                        </div>
                        <time
                          dateTime={item.created_at}
                          className="text-xs text-[#94A3B8]"
                        >
                          {formatDatePtBr(item.created_at)}
                        </time>
                      </div>

                      <h2 className="mt-4 text-lg font-semibold text-white">
                        {item.title}
                      </h2>
                      <p className="mt-2.5 whitespace-pre-line text-sm leading-[1.7] text-[#CBD5E1]">
                        {item.content}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#1E3A52] pt-4">
                        {item.status !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busyKey !== null}
                            onClick={() =>
                              void handleModerationAction(
                                "testimonial",
                                item.id,
                                "reject"
                              )
                            }
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                            Rejeitar
                          </Button>
                        )}
                        {item.status !== "approved" && (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={busyKey !== null}
                            onClick={() =>
                              void handleModerationAction(
                                "testimonial",
                                item.id,
                                "approve"
                              )
                            }
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                            Aprovar
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "replies" && (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {(["pending", "approved", "rejected"] as TestimonialStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setReplyFilter(status)}
                      className={cn(
                        "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                        replyFilter === status
                          ? "border-[#2DD4BF] bg-[#015E57]/35 text-[#2DD4BF]"
                          : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
                      )}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  )
                )}
              </div>

              {filteredReplies.length === 0 ? (
                <Card className="border-[#1E3A52] bg-[#112536] p-8 text-center text-sm text-[#CBD5E1]">
                  Nenhuma resposta de apoio com status{" "}
                  {STATUS_LABELS[replyFilter].toLowerCase()}.
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredReplies.map((reply) => (
                    <Card
                      key={reply.id}
                      className="border-[#1E3A52] bg-[#112536] p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E3A52] pb-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-sm font-semibold text-[#2DD4BF]">
                            {reply.pseudonym}
                          </span>
                          <Badge
                            variant={
                              reply.status === "approved"
                                ? "accent"
                                : reply.status === "rejected"
                                  ? "warning"
                                  : "neutral"
                            }
                          >
                            {STATUS_LABELS[reply.status]}
                          </Badge>
                          {reply.moderation_flag &&
                            reply.moderation_flag !== "ok" && (
                              <Badge variant="warning" className="gap-1">
                                <ShieldAlert
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                                Sinal: {reply.moderation_flag}
                              </Badge>
                            )}
                        </div>
                        <time
                          dateTime={reply.created_at}
                          className="text-xs text-[#94A3B8]"
                        >
                          {formatDatePtBr(reply.created_at)}
                        </time>
                      </div>

                      {reply.testimonial_title && (
                        <p className="mt-3 text-xs text-[#94A3B8]">
                          Em resposta ao relato:{" "}
                          <strong className="font-medium text-white">
                            {reply.testimonial_title}
                          </strong>
                        </p>
                      )}

                      <p className="mt-3 whitespace-pre-line text-sm leading-[1.7] text-[#CBD5E1]">
                        {reply.content}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#1E3A52] pt-4">
                        {reply.status !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busyKey !== null}
                            onClick={() =>
                              void handleModerationAction(
                                "reply",
                                reply.id,
                                "reject"
                              )
                            }
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                            Rejeitar
                          </Button>
                        )}
                        {reply.status !== "approved" && (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={busyKey !== null}
                            onClick={() =>
                              void handleModerationAction(
                                "reply",
                                reply.id,
                                "approve"
                              )
                            }
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                            Aprovar
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "professionals" && (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {(["pending", "approved"] as ProfessionalStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setProfessionalFilter(status)}
                        className={cn(
                          "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                          professionalFilter === status
                            ? "border-[#2DD4BF] bg-[#015E57]/35 text-[#2DD4BF]"
                            : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
                        )}
                      >
                        {PROFESSIONAL_STATUS_LABELS[status]}
                      </button>
                    )
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {VERIFICATION_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#1E3A52] bg-[#021729] px-3 py-1.5 text-xs font-medium text-[#2DD4BF] transition-colors hover:border-[#015E57] hover:text-white"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {filteredProfessionals.length === 0 ? (
                <Card className="border-[#1E3A52] bg-[#112536] p-8 text-center text-sm text-[#CBD5E1]">
                  Nenhum cadastro de profissional com status{" "}
                  {PROFESSIONAL_STATUS_LABELS[professionalFilter].toLowerCase()}.
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredProfessionals.map((pro) => (
                    <Card
                      key={pro.id}
                      className="border-[#1E3A52] bg-[#112536] p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1E3A52] pb-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="accent">{pro.specialty}</Badge>
                            {pro.is_online && (
                              <Badge variant="neutral" className="gap-1">
                                <Globe
                                  className="h-3 w-3 text-[#2DD4BF]"
                                  aria-hidden="true"
                                />
                                Atendimento Online
                              </Badge>
                            )}
                            <Badge
                              variant={
                                pro.status === "approved" ? "accent" : "neutral"
                              }
                            >
                              {PROFESSIONAL_STATUS_LABELS[pro.status]}
                            </Badge>
                          </div>

                          <h2 className="mt-2.5 text-lg font-semibold text-white">
                            {pro.name}
                          </h2>
                          <p className="mt-0.5 text-xs font-semibold text-[#2DD4BF]">
                            {pro.license_number}
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#CBD5E1]">
                            <MapPin
                              className="h-3.5 w-3.5 text-[#94A3B8]"
                              aria-hidden="true"
                            />
                            {pro.city}, {pro.state}
                          </p>
                        </div>

                        <a
                          href={pro.contact_url}
                          target={
                            pro.contact_url.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            pro.contact_url.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#015E57] bg-[#021729] px-3 py-1.5 text-xs font-medium text-[#2DD4BF] transition-colors hover:bg-[#015E57] hover:text-white"
                        >
                          Link de contato
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      </div>

                      <p className="mt-4 whitespace-pre-line text-sm leading-[1.7] text-[#CBD5E1]">
                        {pro.bio}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#1E3A52] pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busyKey !== null}
                          onClick={() =>
                            void handleModerationAction(
                              "professional",
                              pro.id,
                              "reject"
                            )
                          }
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                          Rejeitar
                        </Button>
                        {pro.status !== "approved" && (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={busyKey !== null}
                            onClick={() =>
                              void handleModerationAction(
                                "professional",
                                pro.id,
                                "approve"
                              )
                            }
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                            Aprovar
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}
          {activeTab === "articles" && (
            <AdminArticlesTab
              articles={articles}
              loading={loading}
              onArticlesChange={setArticles}
            />
          )}
        </>
      )}
    </div>
  );
}

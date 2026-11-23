"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  HandHeart,
  MessageSquarePlus,
  PenLine,
  PhoneCall,
  ShieldAlert,
  X,
} from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import type { Testimonial } from "@/lib/types";
import { cn, formatDatePtBr } from "@/lib/utils";

interface TestimonialsMuralProps {
  initialTestimonials: Testimonial[];
}

interface ReplyDraftState {
  pseudonym: string;
  content: string;
  submitting: boolean;
  error: string | null;
  isCrisis: boolean;
  successMessage: string | null;
}

const EMPTY_REPLY_STATE: ReplyDraftState = {
  pseudonym: "",
  content: "",
  submitting: false,
  error: null,
  isCrisis: false,
  successMessage: null,
};

function CrisisInlineCard({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-[#DC2626]/60 bg-[#991B1B]/20 p-4 text-sm leading-relaxed text-white"
    >
      <div className="flex items-start gap-3">
        <PhoneCall
          className="mt-0.5 h-5 w-5 shrink-0 text-[#FCA5A5]"
          aria-hidden="true"
        />
        <div className="space-y-3">
          <p className="font-semibold text-white">
            Apoio humano imediato disponível agora
          </p>
          <p className="text-[#E2E8F0]">{message}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:188"
              className={buttonClasses({ variant: "danger", size: "sm" })}
            >
              Ligar 188 (CVV)
            </a>
            <a
              href="tel:190"
              className={buttonClasses({ variant: "secondary", size: "sm" })}
            >
              Polícia Militar 190
            </a>
            <a
              href="tel:192"
              className={buttonClasses({ variant: "secondary", size: "sm" })}
            >
              SAMU 192
            </a>
            <Link
              href="/ajuda-urgente"
              className={buttonClasses({ variant: "outline", size: "sm" })}
            >
              Ver todos os canais
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMural({
  initialTestimonials,
}: TestimonialsMuralProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [pseudonym, setPseudonym] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isCrisis, setIsCrisis] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const [supportCounts, setSupportCounts] = React.useState<
    Record<string, number>
  >(() => {
    const initial: Record<string, number> = {};
    for (const item of initialTestimonials) {
      initial[item.id] = item.support_count ?? 0;
    }
    return initial;
  });
  const [supportedIds, setSupportedIds] = React.useState<
    Record<string, boolean>
  >({});

  const [openReplyId, setOpenReplyId] = React.useState<string | null>(null);
  const [replyStates, setReplyStates] = React.useState<
    Record<string, ReplyDraftState>
  >({});

  const formSectionRef = React.useRef<HTMLDivElement>(null);

  function openForm() {
    setIsFormOpen(true);
    setSuccessMessage(null);
    setError(null);
    setIsCrisis(false);
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsCrisis(false);
    setSuccessMessage(null);

    const trimmedPseudonym = pseudonym.trim();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedPseudonym.length < 2) {
      setError("Informe um pseudônimo com pelo menos 2 caracteres.");
      return;
    }
    if (trimmedTitle.length < 5) {
      setError("Escreva um título com pelo menos 5 caracteres.");
      return;
    }
    if (trimmedContent.length < 30) {
      setError("Escreva seu relato com pelo menos 30 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudonym: trimmedPseudonym,
          title: trimmedTitle,
          content: trimmedContent,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        isCrisis?: boolean;
      };

      if (!response.ok) {
        setError(data.error ?? "Não foi possível enviar seu relato.");
        setIsCrisis(Boolean(data.isCrisis));
        return;
      }

      setSuccessMessage(
        data.message ??
          "Seu relato foi enviado para moderação e será publicado após revisão."
      );
      setPseudonym("");
      setTitle("");
      setContent("");
    } catch {
      setError("Erro de conexão ao enviar. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSupport(testimonialId: string) {
    if (supportedIds[testimonialId]) return;

    setSupportedIds((prev) => ({ ...prev, [testimonialId]: true }));
    setSupportCounts((prev) => ({
      ...prev,
      [testimonialId]: (prev[testimonialId] ?? 0) + 1,
    }));

    try {
      await fetch("/api/testimonials/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId }),
      });
    } catch {
      // Keep optimistic count for the current session.
    }
  }

  function updateReplyState(
    testimonialId: string,
    patch: Partial<ReplyDraftState>
  ) {
    setReplyStates((prev) => ({
      ...prev,
      [testimonialId]: {
        ...(prev[testimonialId] ?? EMPTY_REPLY_STATE),
        ...patch,
      },
    }));
  }

  function toggleReplyForm(testimonialId: string) {
    setOpenReplyId((prev) => (prev === testimonialId ? null : testimonialId));
  }

  async function handleReplySubmit(
    event: React.FormEvent<HTMLFormElement>,
    testimonialId: string
  ) {
    event.preventDefault();
    const state = replyStates[testimonialId] ?? EMPTY_REPLY_STATE;
    const trimmedPseudonym = state.pseudonym.trim();
    const trimmedContent = state.content.trim();

    updateReplyState(testimonialId, {
      error: null,
      isCrisis: false,
      successMessage: null,
    });

    if (trimmedPseudonym.length < 2) {
      updateReplyState(testimonialId, {
        error: "Informe um pseudônimo com pelo menos 2 caracteres.",
      });
      return;
    }

    if (trimmedContent.length < 10) {
      updateReplyState(testimonialId, {
        error: "Escreva uma mensagem de apoio com pelo menos 10 caracteres.",
      });
      return;
    }

    updateReplyState(testimonialId, { submitting: true });

    try {
      const response = await fetch("/api/testimonials/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testimonialId,
          pseudonym: trimmedPseudonym,
          content: trimmedContent,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        isCrisis?: boolean;
      };

      if (!response.ok) {
        updateReplyState(testimonialId, {
          submitting: false,
          error: data.error ?? "Não foi possível enviar sua mensagem de apoio.",
          isCrisis: Boolean(data.isCrisis),
        });
        return;
      }

      updateReplyState(testimonialId, {
        pseudonym: "",
        content: "",
        submitting: false,
        error: null,
        isCrisis: false,
        successMessage:
          data.message ??
          "Mensagem recebida. Ela será revisada antes de aparecer no mural.",
      });
    } catch {
      updateReplyState(testimonialId, {
        submitting: false,
        error: "Erro de conexão ao enviar. Tente novamente em instantes.",
      });
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#015E57]/60 bg-[#112536] p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Sua experiência pode ajudar outro homem a romper o silêncio
          </h2>
          <p className="mt-1 text-sm text-[#CBD5E1]">
            Todos os relatos são publicados com pseudônimo e revisados antes de
            ir ao ar.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={openForm}
          className="shrink-0"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
          Compartilhar Minha História
        </Button>
      </div>

      <div ref={formSectionRef}>
        {isFormOpen && (
          <Card className="border-[#015E57] bg-[#112536] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#1E3A52] pb-5">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Compartilhar Minha História
                </h2>
                <p className="mt-1 text-sm text-[#CBD5E1]">
                  Escreva no seu ritmo. Você não precisa se identificar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Fechar formulário"
                className="cursor-pointer rounded-lg p-1.5 text-[#CBD5E1] transition-colors hover:bg-[#021729] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#015E57]/70 bg-[#021729] p-4 text-sm leading-relaxed text-[#CBD5E1]">
              <ShieldAlert
                className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4BF]"
                aria-hidden="true"
              />
              <p>
                <strong className="font-semibold text-white">
                  Aviso de privacidade e moderação:
                </strong>{" "}
                Evite incluir nomes reais, sobrenomes, empresas, endereços ou
                detalhes que identifiquem você ou terceiros. Todo relato passa
                por triagem de segurança e moderação manual antes de ser
                publicado no mural.
              </p>
            </div>

            {successMessage ? (
              <div
                role="status"
                className="mt-6 rounded-lg border border-[#015E57] bg-[#015E57]/20 p-5 text-white"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#2DD4BF]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold">Relato recebido com cuidado</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#CBD5E1]">
                      {successMessage}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSuccessMessage(null);
                      setIsFormOpen(false);
                    }}
                  >
                    Voltar ao mural
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Pseudônimo"
                    name="pseudonym"
                    placeholder="Ex.: Carlos M. ou Anônimo SP"
                    value={pseudonym}
                    onChange={(e) => setPseudonym(e.target.value)}
                    maxLength={60}
                    required
                    hint="Use apenas um primeiro nome, iniciais ou apelido."
                  />
                  <Input
                    label="Título do relato"
                    name="title"
                    placeholder="Uma frase curta que resuma sua história"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={140}
                    required
                  />
                </div>

                <Textarea
                  label="Seu relato"
                  name="content"
                  rows={6}
                  placeholder="Conte o que você viveu, o que ajudou você a perceber a situação ou como está reconstruindo sua rotina..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={4000}
                  required
                  hint={`${content.trim().length} / 4000 caracteres (mínimo de 30).`}
                />

                {error && isCrisis && <CrisisInlineCard message={error} />}

                {error && !isCrisis && (
                  <p
                    role="alert"
                    className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-4 py-3 text-sm text-[#FCA5A5]"
                  >
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setIsFormOpen(false)}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={submitting}
                  >
                    {submitting ? "Enviando relato..." : "Enviar para moderação"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}
      </div>

      <section
        aria-label="Relatos publicados"
        className="grid gap-6 md:grid-cols-2"
      >
        {initialTestimonials.map((item) => {
          const count = supportCounts[item.id] ?? item.support_count ?? 0;
          const hasSupported = Boolean(supportedIds[item.id]);
          const replies = item.replies ?? [];
          const isReplyOpen = openReplyId === item.id;
          const replyState = replyStates[item.id] ?? EMPTY_REPLY_STATE;

          return (
            <Card
              key={item.id}
              className="flex flex-col justify-between border-[#015E57]/60 bg-[#112536] p-6"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E3A52] pb-3">
                  <span className="text-sm font-semibold text-[#2DD4BF]">
                    {item.pseudonym}
                  </span>
                  <time
                    dateTime={item.created_at}
                    className="text-xs text-[#94A3B8]"
                  >
                    {formatDatePtBr(item.created_at)}
                  </time>
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
                  {item.title}
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-[1.7] text-[#CBD5E1]">
                  {item.content}
                </p>
              </div>

              <div className="mt-6 space-y-4 border-t border-[#1E3A52] pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleSupport(item.id)}
                    disabled={hasSupported}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-default",
                      hasSupported
                        ? "border-[#2DD4BF]/60 bg-[#015E57]/35 text-[#2DD4BF]"
                        : "border-[#015E57] bg-[#021729] text-[#E2E8F0] hover:border-[#2DD4BF] hover:bg-[#015E57]/25"
                    )}
                  >
                    <HandHeart className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Me identifiquei ({count})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleReplyForm(item.id)}
                    aria-expanded={isReplyOpen}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#CBD5E1] transition-colors hover:text-[#2DD4BF]"
                  >
                    <MessageSquarePlus
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    <span>
                      {isReplyOpen
                        ? "Fechar apoio"
                        : "Enviar mensagem de apoio"}
                    </span>
                  </button>
                </div>

                {replies.length > 0 && (
                  <div className="space-y-3 border-l-2 border-[#015E57] pl-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Mensagens de apoio ({replies.length})
                    </p>
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-lg bg-[#021729] p-3.5 text-xs leading-relaxed text-[#CBD5E1]"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-[#2DD4BF]">
                            {reply.pseudonym}
                          </span>
                          <time
                            dateTime={reply.created_at}
                            className="text-[11px] text-[#94A3B8]"
                          >
                            {formatDatePtBr(reply.created_at)}
                          </time>
                        </div>
                        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#E2E8F0]">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {isReplyOpen && (
                  <div className="rounded-lg border border-[#015E57]/70 bg-[#021729] p-4">
                    <p className="text-xs leading-relaxed text-[#94A3B8]">
                      Mensagens de apoio passam por triagem de segurança e
                      revisão humana antes de aparecerem no mural. Evite nomes
                      reais ou contatos pessoais.
                    </p>

                    {replyState.successMessage ? (
                      <div
                        role="status"
                        className="mt-3 rounded-lg border border-[#015E57] bg-[#015E57]/20 p-3 text-xs leading-relaxed text-[#E2E8F0]"
                      >
                        <p className="font-semibold text-white">
                          Mensagem recebida
                        </p>
                        <p className="mt-1">{replyState.successMessage}</p>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => handleReplySubmit(e, item.id)}
                        className="mt-3 space-y-3"
                        noValidate
                      >
                        <Input
                          label="Seu pseudônimo"
                          placeholder="Ex.: Paulo R."
                          value={replyState.pseudonym}
                          onChange={(e) =>
                            updateReplyState(item.id, {
                              pseudonym: e.target.value,
                            })
                          }
                          maxLength={60}
                          required
                        />

                        <Textarea
                          label="Mensagem de apoio"
                          rows={3}
                          placeholder="Escreva uma palavra respeitosa de apoio para quem compartilhou este relato..."
                          value={replyState.content}
                          onChange={(e) =>
                            updateReplyState(item.id, {
                              content: e.target.value,
                            })
                          }
                          maxLength={1500}
                          required
                        />

                        {replyState.error && replyState.isCrisis && (
                          <CrisisInlineCard message={replyState.error} />
                        )}

                        {replyState.error && !replyState.isCrisis && (
                          <p
                            role="alert"
                            className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-3 py-2 text-xs text-[#FCA5A5]"
                          >
                            {replyState.error}
                          </p>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpenReplyId(null)}
                            disabled={replyState.submitting}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={replyState.submitting}
                          >
                            {replyState.submitting
                              ? "Enviando..."
                              : "Enviar apoio"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

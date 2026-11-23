"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  Send,
  Trash2,
  Download,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface HaroldoChatProps {
  initialContext?: string;
}

const STARTER_PROMPTS = [
  "Não sei se o que vivo é abuso",
  "Sinto culpa o tempo todo",
  "Como me proteger emocionalmente?",
];

const CLIENT_CRISIS_REGEX =
  /(suicid|me matar|tirar a pr[oó]pria vida|acabar com tudo|n[aã]o quero mais viver|quero morrer|vontade de morrer|me machucar|automutil|vai me matar|amea[cç]a de morte|me agredindo agora)/i;

const INITIAL_GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Olá. Eu sou o H.Aroldo. Este é um espaço calmo, sigiloso e sem julgamentos para você organizar o que está sentindo. Você pode começar contando o que aconteceu recentemente ou escolher uma das sugestões abaixo.",
};

export function HaroldoChat({ initialContext }: HaroldoChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [ephemeralMode, setEphemeralMode] = useState(true);
  const [crisisActive, setCrisisActive] = useState(false);
  const [contextBanner, setContextBanner] = useState(
    initialContext?.trim() || ""
  );
  const [errorMessage, setErrorMessage] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (messages.length <= 1 && !crisisActive) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: isStreaming ? "auto" : "smooth",
    });
  }, [messages, crisisActive, isStreaming]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) {
      return;
    }

    setErrorMessage("");

    if (CLIENT_CRISIS_REGEX.test(trimmed)) {
      setCrisisActive(true);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const assistantId = `assistant-${Date.now() + 1}`;
    const nextHistory = [...messages, userMsg];

    setMessages([
      ...nextHistory,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const apiMessages = nextHistory
        .filter((m) => m.id !== "greeting")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/haroldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          context: contextBanner || undefined,
        }),
        signal: controller.signal,
      });

      if (response.headers.get("X-Haroldo-Crisis") === "true") {
        setCrisisActive(true);
      }

      if (!response.ok || !response.body) {
        const errData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(
          errData.error ?? "Não foi possível obter resposta agora."
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        let displayContent = accumulated;
        if (displayContent.includes("[CRISE]")) {
          setCrisisActive(true);
          displayContent = displayContent.replace(/\[CRISE\]\s*/g, "");
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: displayContent } : m
          )
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return;
      }
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Erro de conexão ao conversar com o H.Aroldo."
      );
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      requestAnimationFrame(() => {
        textareaRef.current?.focus({ preventScroll: true });
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleClearConversation() {
    abortRef.current?.abort();
    setIsStreaming(false);
    setMessages([INITIAL_GREETING]);
    setCrisisActive(false);
    setErrorMessage("");
    setInput("");
  }

  function handleDownloadTranscript() {
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10);
    const formattedDate = now.toLocaleString("pt-BR");

    const lines: string[] = [
      "Homem Abusado, Registro de conversa com o H.Aroldo",
      `Exportado em: ${formattedDate}`,
      "Aviso: arquivo gerado localmente no navegador. Guarde em local seguro.",
      "",
    ];

    if (contextBanner) {
      lines.push(`Contexto do Termômetro: ${contextBanner}`, "");
    }

    for (const msg of messages) {
      if (msg.id === "greeting") continue;
      const author = msg.role === "user" ? "Você" : "H.Aroldo";
      lines.push(`[${author}]`, msg.content.trim(), "");
    }

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `haroldo-conversa-${dateStamp}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const hasUserMessages = messages.some((m) => m.role === "user");

  return (
    <div className="space-y-6">
      {crisisActive && (
        <aside
          role="alert"
          aria-label="Canais de ajuda imediata"
          className="rounded-xl border-2 border-[#DC2626] bg-[#2A0E14] p-6 text-white"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#FCA5A5]">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <span>Atenção imediata</span>
              </div>
              <h2 className="text-lg font-semibold text-white">
                Se você estiver em risco agora, procure ajuda humana imediata
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#F1F5F9]">
                O H.Aroldo é uma inteligência artificial e não substitui socorro
                presencial ou atendimento de crise. Os canais abaixo são
                gratuitos e funcionam 24 horas por dia:
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <a
              href="tel:188"
              className="flex items-center gap-3 rounded-lg border border-[#DC2626]/50 bg-[#021729] p-4 transition-colors hover:border-[#FCA5A5]"
            >
              <PhoneCall
                className="h-5 w-5 shrink-0 text-[#FCA5A5]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-white">CVV: 188</p>
                <p className="text-xs text-[#CBD5E1]">
                  Apoio emocional 24h, sigiloso
                </p>
              </div>
            </a>

            <a
              href="tel:190"
              className="flex items-center gap-3 rounded-lg border border-[#DC2626]/50 bg-[#021729] p-4 transition-colors hover:border-[#FCA5A5]"
            >
              <PhoneCall
                className="h-5 w-5 shrink-0 text-[#FCA5A5]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Polícia Militar: 190
                </p>
                <p className="text-xs text-[#CBD5E1]">
                  Agressão ou ameaça imediata
                </p>
              </div>
            </a>

            <a
              href="tel:192"
              className="flex items-center gap-3 rounded-lg border border-[#DC2626]/50 bg-[#021729] p-4 transition-colors hover:border-[#FCA5A5]"
            >
              <PhoneCall
                className="h-5 w-5 shrink-0 text-[#FCA5A5]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-white">SAMU: 192</p>
                <p className="text-xs text-[#CBD5E1]">Emergência médica</p>
              </div>
            </a>
          </div>

          <div className="mt-4">
            <Link
              href="/ajuda-urgente"
              className="text-sm font-medium text-[#2DD4BF] underline underline-offset-4 hover:text-white"
            >
              Ver todos os canais de ajuda urgente e orientação de segurança
            </Link>
          </div>
        </aside>
      )}

      {contextBanner && (
        <div className="rounded-xl border border-[#015E57] bg-[#112536] p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#2DD4BF]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Contexto trazido do Termômetro</span>
              </div>
              <p className="text-sm text-[#CBD5E1]">{contextBanner}</p>
            </div>
            <button
              type="button"
              onClick={() => setContextBanner("")}
              aria-label="Dispensar contexto do Termômetro"
              className="p-1 text-[#94A3B8] hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {!hasUserMessages && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="primary"
                disabled={isStreaming}
                onClick={() =>
                  void sendMessage(
                    `Acabei de fazer o Termômetro de sinais e quero conversar sobre isso: ${contextBanner}`
                  )
                }
              >
                Começar conversa com este resumo
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#015E57] bg-[#112536]">
        {/* Top bar: H.Aroldo identity + privacy controls */}
        <div className="flex flex-col gap-4 border-b border-[#1E3A52] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#015E57] bg-[#021729] text-sm font-semibold tracking-tight text-[#2DD4BF]"
            >
              H.A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">H.Aroldo</h2>
                <Badge variant="accent">Escuta ativa</Badge>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Assistente de acolhimento. Não substitui terapia ou orientação
                jurídica.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={ephemeralMode}
              onClick={() => setEphemeralMode((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                ephemeralMode
                  ? "border-[#015E57] bg-[#015E57]/25 text-[#2DD4BF]"
                  : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1]"
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                Modo Conversa Efêmera: {ephemeralMode ? "Ativo" : "Pausado"}
              </span>
            </button>

            <Button
              variant="ghost"
              size="sm"
              disabled={!hasUserMessages || isStreaming}
              onClick={handleDownloadTranscript}
              className="border border-[#1E3A52] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Baixar conversa (.txt)</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearConversation}
              className="border border-[#1E3A52] text-[#CBD5E1] hover:border-[#DC2626]/60 hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Apagar conversa agora</span>
            </Button>
          </div>
        </div>

        {/* Privacy note bar */}
        <div className="border-b border-[#1E3A52] bg-[#021729]/60 px-5 py-2.5 text-xs text-[#94A3B8]">
          {ephemeralMode
            ? "Conversa mantida apenas na memória desta aba. Nada é salvo em banco de dados e fechar ou atualizar a página apaga o histórico."
            : "Mesmo com o aviso recolhido, o portal não grava suas mensagens em banco de dados. Use Apagar conversa agora ou ESC para sair rapidamente."}
        </div>

        {/* Messages thread */}
        <div
          ref={messagesContainerRef}
          role="log"
          aria-live="polite"
          aria-label="Histórico da conversa com o H.Aroldo"
          className="flex max-h-[540px] min-h-[340px] flex-col gap-4 overflow-y-auto px-5 py-6"
        >
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col gap-1",
                  isUser ? "items-end" : "items-start"
                )}
              >
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]">
                  {isUser ? "Você" : "H.Aroldo"}
                </span>
                <div
                  className={cn(
                    "max-w-[88%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed sm:max-w-[78%]",
                    isUser
                      ? "border border-[#027A71] bg-[#015E57] text-white"
                      : "border border-[#1E3A52] bg-[#021729] text-[#F1F5F9]"
                  )}
                >
                  {msg.content || (
                    <span className="text-[#94A3B8]">Escrevendo...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Starter suggestions */}
        {!hasUserMessages && (
          <div className="border-t border-[#1E3A52] bg-[#021729]/40 px-5 py-4">
            <p className="mb-2.5 text-xs font-medium text-[#94A3B8]">
              Sugestões para começar:
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isStreaming}
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-lg border border-[#015E57] bg-[#021729] px-3 py-2 text-left text-xs font-medium text-[#CBD5E1] transition-colors hover:bg-[#015E57] hover:text-white cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-[#1E3A52] bg-[#021729] p-4"
        >
          {errorMessage && (
            <p role="alert" className="mb-3 text-xs text-[#F87171]">
              {errorMessage}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="haroldo-input" className="sr-only">
                Escreva sua mensagem para o H.Aroldo
              </label>
              <textarea
                ref={textareaRef}
                id="haroldo-input"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder="Escreva no seu ritmo... (Enter para enviar, Shift+Enter para nova linha)"
                disabled={isStreaming}
                className="w-full resize-none rounded-lg border-[1.5px] border-[#015E57] bg-[#112536] px-3.5 py-2.5 text-sm text-white placeholder:text-[#94A3B8] focus:border-[#2DD4BF] focus:outline-none disabled:opacity-60"
              />
            </div>
            <Button
              type="submit"
              disabled={isStreaming || input.trim().length === 0}
              className="h-[46px] shrink-0"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              <span>{isStreaming ? "Enviando..." : "Enviar"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

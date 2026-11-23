"use client";

import * as React from "react";
import {
  Download,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type JournalTag =
  | "Crítica / Humilhação"
  | "Isolamento"
  | "Controle"
  | "Chantagem"
  | "Outro";

const JOURNAL_TAGS: JournalTag[] = [
  "Crítica / Humilhação",
  "Isolamento",
  "Controle",
  "Chantagem",
  "Outro",
];

interface JournalEntry {
  id: string;
  occurredAt: string;
  facts: string;
  impact: string;
  tag?: JournalTag;
  createdAt: string;
}

const SESSION_ENTRIES_KEY = "habusado_private_journal_entries";
const SESSION_OPTIN_KEY = "habusado_private_journal_optin";

function getLocalDateTimeInputValue(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  const local = new Date(now.getTime() - offsetMs);
  return local.toISOString().slice(0, 16);
}

function formatDateTimePtBr(raw: string): string {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function PrivateJournal() {
  const [entries, setEntries] = React.useState<JournalEntry[]>([]);
  const [keepInSession, setKeepInSession] = React.useState(false);

  const [occurredAt, setOccurredAt] = React.useState("");
  const [facts, setFacts] = React.useState("");
  const [impact, setImpact] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<JournalTag | "">("");
  const [error, setError] = React.useState<string | null>(null);
  const [statusNotice, setStatusNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOccurredAt(getLocalDateTimeInputValue());

    try {
      const optedIn = window.sessionStorage.getItem(SESSION_OPTIN_KEY) === "1";
      if (optedIn) {
        const raw = window.sessionStorage.getItem(SESSION_ENTRIES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          if (Array.isArray(parsed)) {
            setEntries(parsed as JournalEntry[]);
          }
        }
        setKeepInSession(true);
      }
    } catch {
      // Ignore storage errors in restricted browsing modes.
    }
  }, []);

  React.useEffect(() => {
    try {
      if (keepInSession) {
        window.sessionStorage.setItem(SESSION_OPTIN_KEY, "1");
        window.sessionStorage.setItem(
          SESSION_ENTRIES_KEY,
          JSON.stringify(entries)
        );
      } else {
        window.sessionStorage.removeItem(SESSION_OPTIN_KEY);
        window.sessionStorage.removeItem(SESSION_ENTRIES_KEY);
      }
    } catch {
      // Ignore storage errors in restricted browsing modes.
    }
  }, [keepInSession, entries]);

  function handleAddEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatusNotice(null);

    const trimmedFacts = facts.trim();
    const trimmedImpact = impact.trim();

    if (trimmedFacts.length < 10) {
      setError(
        "Descreva os fatos objetivos do episódio com pelo menos 10 caracteres."
      );
      return;
    }

    const newEntry: JournalEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      occurredAt: occurredAt || getLocalDateTimeInputValue(),
      facts: trimmedFacts,
      impact: trimmedImpact,
      tag: selectedTag || undefined,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setFacts("");
    setImpact("");
    setSelectedTag("");
    setOccurredAt(getLocalDateTimeInputValue());
    setStatusNotice("Registro adicionado apenas na memória deste navegador.");
  }

  function handleRemoveEntry(id: string) {
    setEntries((prev) => prev.filter((item) => item.id !== id));
    setStatusNotice(null);
  }

  function handleWipeAll() {
    setEntries([]);
    setKeepInSession(false);
    setError(null);
    try {
      window.sessionStorage.removeItem(SESSION_OPTIN_KEY);
      window.sessionStorage.removeItem(SESSION_ENTRIES_KEY);
    } catch {
      // Ignore storage errors.
    }
    setStatusNotice(
      "Todos os registros foram apagados da memória e da sessão."
    );
  }

  function handleDownloadTxt() {
    if (entries.length === 0) return;

    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10);
    const headerLines = [
      "DIARIO PRIVADO DE EPISODIOS",
      `Exportado em: ${formatDateTimePtBr(now.toISOString())}`,
      `Total de registros: ${entries.length}`,
      "Documento gerado localmente no navegador.",
      "",
      "========================================",
      "",
    ];

    const bodyLines = entries.flatMap((entry, index) => {
      const lines = [
        `Registro #${entries.length - index}`,
        `Data e hora: ${formatDateTimePtBr(entry.occurredAt)}`,
      ];
      if (entry.tag) {
        lines.push(`Categoria: ${entry.tag}`);
      }
      lines.push("O que aconteceu (fatos objetivos):");
      lines.push(entry.facts);
      if (entry.impact) {
        lines.push("Como voce se sentiu / impacto:");
        lines.push(entry.impact);
      }
      lines.push("");
      lines.push("========================================");
      lines.push("");
      return lines;
    });

    const blob = new Blob([[...headerLines, ...bodyLines].join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diario-episodios-${dateStamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusNotice(
      "Arquivo .txt baixado no seu dispositivo. Guarde-o em local seguro."
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl border border-[#015E57] bg-[#112536] p-5 text-sm leading-relaxed text-[#CBD5E1]">
        <Lock
          className="mt-0.5 h-5 w-5 shrink-0 text-[#2DD4BF]"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-white">
            100% local neste navegador. Nenhum dado é enviado para servidores.
          </p>
          <p className="mt-1">
            Anotar episódios com data, hora e falas literais ajuda a preservar
            sua memória quando há confusão emocional ou distorção de fatos.
            Quando terminar, baixe o arquivo .txt para guardar em local seguro e
            apague os registros da tela.
          </p>
        </div>
      </div>

      <Card className="border-[#1E3A52] bg-[#112536] p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-white">
          Registrar novo episódio
        </h2>
        <p className="mt-1 text-sm text-[#CBD5E1]">
          Prefira descrever o que foi dito ou feito de forma objetiva, como se
          estivesse registrando fatos em uma ata.
        </p>

        <form onSubmit={handleAddEntry} className="mt-6 space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Data e hora"
              type="datetime-local"
              name="occurredAt"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-white">
                Tag opcional
              </span>
              <div
                className="flex flex-wrap gap-2 pt-1"
                role="group"
                aria-label="Selecionar categoria opcional do episódio"
              >
                {JOURNAL_TAGS.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        setSelectedTag((prev) => (prev === tag ? "" : tag))
                      }
                      className={cn(
                        "cursor-pointer rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
                        isSelected
                          ? "border-[#2DD4BF] bg-[#015E57] text-white"
                          : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Textarea
            label="O que aconteceu (fatos objetivos)"
            name="facts"
            rows={4}
            placeholder="Ex.: Às 20h, ao comentar que visitaria minha mãe no domingo, ouvi que eu nunca priorizo a casa e fiquei sem resposta pelo resto da noite."
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            required
          />

          <Textarea
            label="Como você se sentiu / impacto (opcional)"
            name="impact"
            rows={3}
            placeholder="Ex.: Senti tensão no estômago, dúvida sobre se eu estava errado e dificuldade para dormir."
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
          />

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-4 py-3 text-sm text-[#FCA5A5]"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1E3A52] pt-5">
            <label className="inline-flex cursor-pointer items-center gap-2.5 select-none text-xs text-[#CBD5E1] sm:text-sm">
              <input
                type="checkbox"
                checked={keepInSession}
                onChange={(e) => setKeepInSession(e.target.checked)}
                className="h-4 w-4 rounded-md border border-[#015E57] bg-[#021729] accent-[#015E57]"
              />
              <span>
                Manter temporariamente apenas nesta aba (sessionStorage,
                desativado por padrão)
              </span>
            </label>

            <Button type="submit" variant="primary" size="md">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Adicionar registro
            </Button>
          </div>
        </form>
      </Card>

      {statusNotice && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-lg border border-[#015E57] bg-[#015E57]/20 px-4 py-3 text-sm text-[#E2E8F0]"
        >
          <ShieldCheck
            className="h-4 w-4 shrink-0 text-[#2DD4BF]"
            aria-hidden="true"
          />
          <span>{statusNotice}</span>
        </div>
      )}

      <section aria-label="Registros desta sessão" className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-white">
            Registros desta sessão ({entries.length})
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadTxt}
              disabled={entries.length === 0}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Baixar registros (.txt)
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleWipeAll}
              disabled={entries.length === 0 && !keepInSession}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Apagar tudo agora
            </Button>
          </div>
        </div>

        {entries.length === 0 ? (
          <Card className="border-[#1E3A52] bg-[#112536] p-8 text-center">
            <p className="text-sm text-[#CBD5E1]">
              Nenhum episódio registrado ainda. Os registros adicionados acima
              aparecerão aqui e permanecem somente neste navegador.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="border-[#015E57]/60 bg-[#112536] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E3A52] pb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-medium text-[#2DD4BF]">
                      {formatDateTimePtBr(entry.occurredAt)}
                    </span>
                    {entry.tag && <Badge variant="accent">{entry.tag}</Badge>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(entry.id)}
                    aria-label="Remover este registro"
                    className="cursor-pointer rounded-lg p-1 text-[#94A3B8] transition-colors hover:bg-[#021729] hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Fatos objetivos
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-[1.7] text-white">
                      {entry.facts}
                    </p>
                  </div>

                  {entry.impact && (
                    <div className="border-t border-[#1E3A52] pt-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                        Impacto percebido
                      </p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-[1.7] text-[#CBD5E1]">
                        {entry.impact}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

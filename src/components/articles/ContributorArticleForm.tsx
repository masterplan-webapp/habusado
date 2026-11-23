"use client";

import { Fragment, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  PenLine,
  Phone,
  Send,
  ShieldAlert,
} from "lucide-react";
import type { ArticleCategory } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const CATEGORIES: ArticleCategory[] = [
  "Sinais de Abuso",
  "Reconstrução",
  "Paternidade e Família",
  "Saúde Mental",
];

function renderInlineBold(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function SimpleMarkdownPreview({ content }: { content: string }) {
  const trimmed = content.trim();
  if (!trimmed) {
    return (
      <p className="text-sm text-[#94A3B8]">
        Escreva seu texto na aba &quot;Escrever&quot; para visualizar a
        formatação aqui.
      </p>
    );
  }

  const blocks = trimmed.split(/\n{2,}/);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-[#CBD5E1]">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length === 0) return null;

        if (lines.length === 1 && lines[0].startsWith("### ")) {
          return (
            <h3
              key={blockIndex}
              className="pt-2 text-lg font-semibold text-white"
            >
              {lines[0].slice(4)}
            </h3>
          );
        }

        if (lines.length === 1 && lines[0].startsWith("## ")) {
          return (
            <h2
              key={blockIndex}
              className="pt-3 text-xl font-semibold text-white"
            >
              {lines[0].slice(3)}
            </h2>
          );
        }

        if (lines.every((line) => line.startsWith("- ") || line.startsWith("* "))) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1.5 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInlineBold(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInlineBold(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

const INPUT_CLASS =
  "w-full rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] px-3.5 py-2.5 text-sm text-white placeholder:text-[#94A3B8] focus:border-[#2DD4BF] focus:outline-none disabled:opacity-60";

export function ContributorArticleForm() {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorCredentials, setAuthorCredentials] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("Sinais de Abuso");
  const [excerpt, setExcerpt] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "crisis"
  >("idle");
  const [feedback, setFeedback] = useState("");

  function resetForm() {
    setAuthorName("");
    setAuthorEmail("");
    setAuthorCredentials("");
    setAuthorBio("");
    setTitle("");
    setCategory("Sinais de Abuso");
    setExcerpt("");
    setTagsInput("");
    setContent("");
    setEditorTab("write");
    setStatus("idle");
    setFeedback("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    if (!authorName.trim() || !authorEmail.trim() || !authorCredentials.trim()) {
      setStatus("error");
      setFeedback(
        "Preencha seu nome, e-mail de contato e qualificação ou registro profissional."
      );
      return;
    }

    if (!title.trim() || !excerpt.trim()) {
      setStatus("error");
      setFeedback("Informe o título e o resumo do artigo.");
      return;
    }

    if (content.trim().length < 300) {
      setStatus("error");
      setFeedback(
        "O texto do artigo precisa ter pelo menos 300 caracteres para avaliação editorial."
      );
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setStatus("submitting");

    try {
      const response = await fetch("/api/articles/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: authorName.trim(),
          author_email: authorEmail.trim(),
          author_credentials: authorCredentials.trim(),
          author_bio: authorBio.trim(),
          title: title.trim(),
          category,
          excerpt: excerpt.trim(),
          content: content.trim(),
          tags,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        isCrisis?: boolean;
      };

      if (response.status === 422 && data.isCrisis) {
        setStatus("crisis");
        setFeedback(
          data.error ??
            "Identificamos sinais de sofrimento agudo no texto enviado. Se você precisa de apoio imediato, acione os canais abaixo."
        );
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setFeedback(
          data.error ?? "Não foi possível enviar o artigo neste momento."
        );
        return;
      }

      setStatus("success");
      setFeedback(
        data.message ??
          "Artigo recebido com sucesso. Nossa equipe editorial vai revisar o material e retornar pelo seu e-mail."
      );
    } catch {
      setStatus("error");
      setFeedback(
        "Erro de conexão ao enviar o artigo. Tente novamente em instantes."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-[#015E57] bg-[#112536] p-8"
      >
        <div className="flex items-start gap-4">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 shrink-0 text-[#2DD4BF]"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-xl font-semibold text-white">
              Proposta de artigo enviada
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              {feedback}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" size="md" onClick={resetForm}>
                Enviar outro artigo
              </Button>
              <Link
                href="/artigos"
                className="inline-flex items-center justify-center rounded-lg border border-[#1E3A52] bg-[#021729] px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition-colors hover:border-[#015E57] hover:text-white"
              >
                Voltar para Artigos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-8"
    >
      {status === "crisis" && (
        <div
          role="alert"
          className="rounded-xl border border-[#DC2626]/60 bg-[#021729] p-5"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert
              className="mt-0.5 h-5 w-5 shrink-0 text-[#FCA5A5]"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                Apoio imediato disponível agora
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
                {feedback}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="tel:188"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#015E57] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#027A71]"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>CVV 188</span>
                </a>
                <a
                  href="tel:190"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E3A52] bg-[#112536] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#015E57]"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Polícia 190</span>
                </a>
                <a
                  href="tel:192"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E3A52] bg-[#112536] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#015E57]"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>SAMU 192</span>
                </a>
                <Link
                  href="/ajuda-urgente"
                  className="inline-flex items-center rounded-lg border border-[#015E57] px-3.5 py-2 text-xs font-semibold text-[#2DD4BF] hover:bg-[#015E57] hover:text-white"
                >
                  Ver todos os canais
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "error" && feedback && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 p-4 text-sm text-[#FCA5A5]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Author Info */}
      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-white">
          1. Identificação do autor
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contrib-name"
              className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
            >
              Nome completo ou como assinar *
            </label>
            <input
              id="contrib-name"
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Ex.: Dra. Helena Martins"
              disabled={status === "submitting"}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label
              htmlFor="contrib-email"
              className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
            >
              E-mail para contato editorial *
            </label>
            <input
              id="contrib-email"
              type="email"
              required
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={status === "submitting"}
              className={INPUT_CLASS}
            />
            <p className="mt-1 text-xs text-[#94A3B8]">
              Uso estritamente interno da curadoria. Nunca será publicado.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="contrib-credentials"
            className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
          >
            Qualificação ou registro profissional *
          </label>
          <input
            id="contrib-credentials"
            type="text"
            required
            value={authorCredentials}
            onChange={(e) => setAuthorCredentials(e.target.value)}
            placeholder="Ex.: CRP 06/123456, OAB/SP 123456, Mestre em Psicologia Clínica"
            disabled={status === "submitting"}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label
            htmlFor="contrib-bio"
            className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
          >
            Breve apresentação do autor (opcional)
          </label>
          <textarea
            id="contrib-bio"
            rows={2}
            value={authorBio}
            onChange={(e) => setAuthorBio(e.target.value)}
            placeholder="Uma ou duas frases sobre sua área de atuação para aparecer ao final do artigo."
            disabled={status === "submitting"}
            className={INPUT_CLASS}
          />
        </div>
      </fieldset>

      {/* Article Details */}
      <fieldset className="space-y-5 border-t border-[#1E3A52] pt-6">
        <legend className="text-base font-semibold text-white">
          2. Conteúdo do artigo
        </legend>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label
              htmlFor="contrib-title"
              className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
            >
              Título do artigo *
            </label>
            <input
              id="contrib-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título claro e objetivo sobre o tema"
              disabled={status === "submitting"}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label
              htmlFor="contrib-category"
              className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
            >
              Categoria *
            </label>
            <select
              id="contrib-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ArticleCategory)}
              disabled={status === "submitting"}
              className={INPUT_CLASS}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="contrib-excerpt"
            className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
          >
            Resumo curto *
          </label>
          <textarea
            id="contrib-excerpt"
            rows={2}
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Em uma ou duas frases, explique o que o leitor vai encontrar neste texto."
            disabled={status === "submitting"}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label
            htmlFor="contrib-tags"
            className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
          >
            Tags (separadas por vírgula)
          </label>
          <input
            id="contrib-tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Ex.: abuso psicológico, limites, paternidade"
            disabled={status === "submitting"}
            className={INPUT_CLASS}
          />
        </div>

        {/* Markdown Editor with Write / Preview tabs */}
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="contrib-content"
              className="text-xs font-medium text-[#CBD5E1]"
            >
              Texto do artigo em Markdown * (mínimo de 300 caracteres)
            </label>

            <div
              role="tablist"
              aria-label="Modo do editor"
              className="inline-flex rounded-lg border border-[#1E3A52] bg-[#021729] p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={editorTab === "write"}
                onClick={() => setEditorTab("write")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                  editorTab === "write"
                    ? "bg-[#015E57] text-white"
                    : "text-[#CBD5E1] hover:text-white"
                )}
              >
                <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Escrever</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={editorTab === "preview"}
                onClick={() => setEditorTab("preview")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                  editorTab === "preview"
                    ? "bg-[#015E57] text-white"
                    : "text-[#CBD5E1] hover:text-white"
                )}
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Pré-visualizar</span>
              </button>
            </div>
          </div>

          {editorTab === "write" ? (
            <textarea
              id="contrib-content"
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Use ## para subtítulos, **negrito** para destaques e - para listas."
              disabled={status === "submitting"}
              className={cn(INPUT_CLASS, "font-mono text-xs leading-relaxed sm:text-sm")}
            />
          ) : (
            <div className="min-h-[260px] rounded-lg border-[1.5px] border-[#1E3A52] bg-[#021729] p-5">
              <SimpleMarkdownPreview content={content} />
            </div>
          )}

          <div className="mt-1.5 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Suporta subtítulos (##), listas (-) e **negrito**.</span>
            <span>{content.trim().length} caracteres</span>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1E3A52] pt-6">
        <p className="max-w-md text-xs leading-relaxed text-[#94A3B8]">
          Ao enviar, você confirma que o texto é de sua autoria, tem caráter
          informativo e respeita o sigilo de pacientes ou clientes.
        </p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === "submitting"}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          <span>
            {status === "submitting"
              ? "Enviando artigo..."
              : "Enviar para revisão editorial"}
          </span>
        </Button>
      </div>
    </form>
  );
}

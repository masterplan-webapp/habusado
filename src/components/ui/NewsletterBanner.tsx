"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface NewsletterBannerProps {
  className?: string;
  title?: string;
  description?: string;
}

export function NewsletterBanner({
  className,
  title = "Receba novos textos e guias no seu e-mail",
  description = "Envio ocasional com artigos sobre limites, saúde emocional e reconstrução. Sem spam e com cancelamento em um clique.",
}: NewsletterBannerProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Informe um endereço de e-mail válido.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus("error");
        setMessage(
          data.error ?? "Não foi possível concluir a inscrição agora."
        );
        return;
      }

      setStatus("success");
      setMessage(
        data.message ??
          "Inscrição confirmada. Você receberá nossos próximos textos por e-mail."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Erro de conexão ao registrar seu e-mail. Tente novamente.");
    }
  }

  return (
    <section
      aria-label="Inscrição na newsletter"
      className={cn(
        "rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>Newsletter</span>
          </div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
            {description}
          </p>
        </div>

        <div className="w-full max-w-md">
          {status === "success" ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-lg border border-[#015E57] bg-[#021729] p-4 text-sm text-[#2DD4BF]"
            >
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>{message}</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
              noValidate
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Seu melhor e-mail
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={status === "submitting"}
                className="flex-1 rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] px-3.5 py-2.5 text-sm text-white placeholder:text-[#94A3B8] focus:border-[#2DD4BF] focus:outline-none"
              />
              <Button
                type="submit"
                disabled={status === "submitting"}
                className="shrink-0"
              >
                {status === "submitting" ? "Enviando..." : "Inscrever-se"}
              </Button>
            </form>
          )}

          {status === "error" && message && (
            <p role="alert" className="mt-2 text-xs text-[#F87171]">
              {message}
            </p>
          )}
          <p className="mt-2.5 text-[11px] text-[#94A3B8]">
            Seus dados são usados apenas para envio da newsletter, conforme
            nossa{" "}
            <Link
              href="/privacidade"
              className="text-[#CBD5E1] underline underline-offset-4 hover:text-[#2DD4BF]"
            >
              Política de Privacidade (LGPD)
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

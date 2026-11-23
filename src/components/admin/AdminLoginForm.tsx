"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Info, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface AdminLoginFormProps {
  devFallbackEnabled: boolean;
}

export function AdminLoginForm({ devFallbackEnabled }: AdminLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError("Informe a senha de moderação.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Senha inválida. Tente novamente.");
        return;
      }

      setPassword("");
      router.refresh();
    } catch {
      setError("Erro de conexão ao autenticar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-6">
      <Card className="rounded-xl border-[#015E57]/40 bg-[#112536] p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-[#1E3A52] pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#015E57] bg-[#021729] text-[#2DD4BF]">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2DD4BF]">
              Acesso restrito
            </p>
            <h1 className="text-xl font-semibold text-white">
              Painel de Moderação
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#CBD5E1]">
          Área interna para revisar relatos anônimos, mensagens de apoio e
          cadastros de profissionais antes da publicação.
        </p>

        {devFallbackEnabled && (
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-[#015E57]/70 bg-[#021729] p-3.5 text-xs leading-relaxed text-[#CBD5E1]">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4BF]"
              aria-hidden="true"
            />
            <p>
              <strong className="font-semibold text-white">
                Ambiente local:
              </strong>{" "}
              a variável <code className="text-[#2DD4BF]">ADMIN_PASSWORD</code>{" "}
              ainda não está definida em{" "}
              <code className="text-[#2DD4BF]">.env.local</code>. Para testes
              locais, utilize a senha{" "}
              <code className="font-semibold text-white">admin-dev</code>.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            label="Senha administrativa"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Digite a senha de acesso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-[#DC2626]/50 bg-[#991B1B]/20 px-3.5 py-2.5 text-xs text-[#FCA5A5]"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Verificando..." : "Entrar no painel"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import type { ProfessionalSpecialty } from "@/lib/types";

const SPECIALTY_OPTIONS: ProfessionalSpecialty[] = [
  "Psicologia",
  "Direito",
  "Psiquiatria",
  "Terapia",
];

const BRAZILIAN_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export function ProfessionalSignupForm() {
  const [name, setName] = React.useState("");
  const [specialty, setSpecialty] =
    React.useState<ProfessionalSpecialty>("Psicologia");
  const [licenseNumber, setLicenseNumber] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("SP");
  const [isOnline, setIsOnline] = React.useState(true);
  const [contactUrl, setContactUrl] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [bio, setBio] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (name.trim().length < 3) {
      setError("Informe seu nome completo.");
      return;
    }
    if (licenseNumber.trim().length < 3) {
      setError("Informe seu número de registro (CRP, OAB ou CRM).");
      return;
    }
    if (city.trim().length < 2) {
      setError("Informe sua cidade.");
      return;
    }
    if (!contactUrl.trim()) {
      setError("Informe um link de contato ou e-mail profissional.");
      return;
    }
    if (bio.trim().length < 30) {
      setError("Escreva uma apresentação com pelo menos 30 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          specialty,
          license_number: licenseNumber.trim(),
          city: city.trim(),
          state,
          is_online: isOnline,
          contact_url: contactUrl.trim(),
          photo_url: photoUrl.trim() || undefined,
          bio: bio.trim(),
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Não foi possível enviar seu cadastro.");
        return;
      }

      setSuccessMessage(
        data.message ??
          "Cadastro recebido. Faremos a verificação manual do seu registro antes da publicação."
      );
      setName("");
      setLicenseNumber("");
      setCity("");
      setContactUrl("");
      setPhotoUrl("");
      setBio("");
    } catch {
      setError("Erro de conexão ao enviar. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <Card className="border-[#015E57] bg-[#112536] p-6 sm:p-8">
        <div role="status" className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 shrink-0 text-[#2DD4BF]"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-xl font-semibold text-white">
              Cadastro enviado para verificação
            </h2>
            <p className="mt-2 text-sm leading-[1.7] text-[#CBD5E1]">
              {successMessage}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/profissionais"
                className={buttonClasses({ variant: "primary", size: "md" })}
              >
                Ver Rede de Profissionais
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={() => setSuccessMessage(null)}
              >
                Enviar outro cadastro
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-[#1E3A52] bg-[#112536] p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#015E57]/70 bg-[#021729] p-4 text-sm leading-relaxed text-[#CBD5E1]">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4BF]"
          aria-hidden="true"
        />
        <p>
          <strong className="font-semibold text-white">
            Verificação manual de credenciais:
          </strong>{" "}
          Conferimos o número de registro (CRP, OAB ou CRM) antes de publicar
          qualquer perfil no diretório público.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Nome completo"
            name="name"
            placeholder="Ex.: Dr. Marcos Oliveira"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="professional-specialty"
              className="text-sm font-medium text-white"
            >
              Especialidade
            </label>
            <select
              id="professional-specialty"
              name="specialty"
              value={specialty}
              onChange={(e) =>
                setSpecialty(e.target.value as ProfessionalSpecialty)
              }
              className="w-full rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-[#2DD4BF] focus:outline-none"
            >
              {SPECIALTY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Input
            label="Registro profissional"
            name="license_number"
            placeholder="Ex.: CRP 06/123456"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            maxLength={50}
            required
            hint="CRP, OAB ou CRM ativo."
          />

          <Input
            label="Cidade"
            name="city"
            placeholder="Ex.: Curitiba"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={80}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="professional-state"
              className="text-sm font-medium text-white"
            >
              Estado (UF)
            </label>
            <select
              id="professional-state"
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-[#2DD4BF] focus:outline-none"
            >
              {BRAZILIAN_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Contato direto (site, WhatsApp ou e-mail)"
            name="contact_url"
            placeholder="https://... ou contato@seudominio.com.br"
            value={contactUrl}
            onChange={(e) => setContactUrl(e.target.value)}
            required
            hint="Use uma URL com https:// ou seu e-mail profissional."
          />

          <Input
            label="URL da foto profissional (opcional)"
            name="photo_url"
            placeholder="https://..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            hint="Opcional. Se deixar em branco, exibiremos suas iniciais."
          />
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2.5 select-none text-sm text-[#E2E8F0]">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={(e) => setIsOnline(e.target.checked)}
            className="h-4 w-4 rounded-md border border-[#015E57] bg-[#021729] accent-[#015E57]"
          />
          <span>Ofereço atendimento online para todo o Brasil</span>
        </label>

        <Textarea
          label="Apresentação profissional"
          name="bio"
          rows={5}
          placeholder="Descreva sua abordagem clínica ou jurídica, tempo de experiência e como você acolhe homens em situação de desgaste ou violência relacional..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={1500}
          required
          hint={`${bio.trim().length} / 1500 caracteres (mínimo de 30).`}
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
          <Link
            href="/profissionais"
            className="text-sm text-[#CBD5E1] underline underline-offset-4 hover:text-white"
          >
            Voltar para a rede
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Enviando cadastro..." : "Enviar cadastro profissional"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Globe,
  MapPin,
  Search,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Professional, ProfessionalSpecialty } from "@/lib/types";
import { cn } from "@/lib/utils";

const SPECIALTIES: Array<"Todas" | ProfessionalSpecialty> = [
  "Todas",
  "Psicologia",
  "Direito",
  "Psiquiatria",
  "Terapia",
];

interface ProfessionalsDirectoryProps {
  professionals: Professional[];
}

function getInitials(name: string): string {
  const parts = name
    .replace(/^(Dr\.|Dra\.)\s*/i, "")
    .trim()
    .split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfessionalsDirectory({
  professionals,
}: ProfessionalsDirectoryProps) {
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<
    "Todas" | ProfessionalSpecialty
  >("Todas");
  const [locationQuery, setLocationQuery] = React.useState("");
  const [onlyOnline, setOnlyOnline] = React.useState(false);

  const filtered = React.useMemo(() => {
    const query = locationQuery.trim().toLowerCase();

    return professionals.filter((pro) => {
      if (
        selectedSpecialty !== "Todas" &&
        pro.specialty !== selectedSpecialty
      ) {
        return false;
      }

      if (onlyOnline && !pro.is_online) {
        return false;
      }

      if (query) {
        const haystack =
          `${pro.city} ${pro.state} ${pro.name} ${pro.specialty}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [professionals, selectedSpecialty, locationQuery, onlyOnline]);

  function clearFilters() {
    setSelectedSpecialty("Todas");
    setLocationQuery("");
    setOnlyOnline(false);
  }

  return (
    <div className="space-y-8">
      <Card className="border-[#1E3A52] bg-[#112536] p-5 sm:p-6">
        <div className="space-y-5">
          <div>
            <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
              Especialidade
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filtrar por especialidade"
            >
              {SPECIALTIES.map((specialty) => {
                const isActive = selectedSpecialty === specialty;
                return (
                  <button
                    key={specialty}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm",
                      isActive
                        ? "border-[#2DD4BF] bg-[#015E57] text-white"
                        : "border-[#1E3A52] bg-[#021729] text-[#CBD5E1] hover:border-[#015E57] hover:text-white"
                    )}
                  >
                    {specialty}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 border-t border-[#1E3A52] pt-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Buscar por cidade ou estado (ex.: São Paulo, PR, MG)"
                aria-label="Buscar por cidade ou estado"
                className="w-full rounded-lg border-[1.5px] border-[#015E57] bg-[#021729] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#94A3B8] transition-colors focus:border-[#2DD4BF] focus:outline-none"
              />
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2.5 select-none text-sm text-[#E2E8F0]">
              <input
                type="checkbox"
                checked={onlyOnline}
                onChange={(e) => setOnlyOnline(e.target.checked)}
                className="h-4 w-4 rounded-md border border-[#015E57] bg-[#021729] accent-[#015E57]"
              />
              <span>Apenas atendimento online</span>
            </label>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between text-sm text-[#94A3B8]">
        <span>
          {filtered.length}{" "}
          {filtered.length === 1
            ? "profissional encontrado"
            : "profissionais encontrados"}
        </span>
        {(selectedSpecialty !== "Todas" ||
          locationQuery.trim() !== "" ||
          onlyOnline) && (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer text-xs font-medium text-[#2DD4BF] underline underline-offset-4 hover:text-white"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-[#1E3A52] bg-[#112536] p-8 text-center">
          <p className="text-base font-medium text-white">
            Nenhum profissional encontrado com esses filtros.
          </p>
          <p className="mt-2 text-sm text-[#CBD5E1]">
            Tente ampliar a busca por cidade ou ativar todas as especialidades.
          </p>
          <div className="mt-5">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Mostrar todos os profissionais
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((pro) => {
            const isExternal =
              pro.contact_url.startsWith("http://") ||
              pro.contact_url.startsWith("https://");

            return (
              <Card
                key={pro.id}
                className="flex flex-col justify-between border-[#1E3A52] bg-[#112536] p-6 transition-colors hover:border-[#015E57]"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#1E3A52] bg-[#021729]">
                      {pro.photo_url ? (
                        <Image
                          src={pro.photo_url}
                          alt={`Foto de ${pro.name}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-[#2DD4BF]">
                          {getInitials(pro.name)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
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
                      </div>

                      <h2 className="mt-2.5 text-lg font-semibold text-white">
                        {pro.name}
                      </h2>

                      <p className="mt-0.5 text-xs font-medium text-[#2DD4BF]">
                        {pro.license_number}
                      </p>

                      <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#CBD5E1]">
                        <MapPin
                          className="h-3.5 w-3.5 text-[#94A3B8]"
                          aria-hidden="true"
                        />
                        {pro.city}, {pro.state}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-[1.7] text-[#CBD5E1]">
                    {pro.bio}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#1E3A52] pt-4">
                  <a
                    href={pro.contact_url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={buttonClasses({
                      variant: "primary",
                      size: "sm",
                      className: "w-full sm:w-auto",
                    })}
                  >
                    Entrar em contato
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#015E57]/70 bg-[#112536] p-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <UserCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-[#2DD4BF]"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-base font-semibold text-white">
              Você atua em Psicologia, Direito, Psiquiatria ou Terapia?
            </h2>
            <p className="mt-1 text-sm text-[#CBD5E1]">
              Cadastre seu perfil para atender homens que buscam acolhimento
              técnico e livre de estigma.
            </p>
          </div>
        </div>
        <Link
          href="/para-profissionais"
          className={buttonClasses({
            variant: "outline",
            size: "md",
            className: "shrink-0",
          })}
        >
          Cadastrar meu perfil
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

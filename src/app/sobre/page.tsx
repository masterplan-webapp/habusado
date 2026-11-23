import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { ABOUT_CONTENT, EMERGENCY_CONTACTS } from "@/data/about-content";
import { buttonClasses } from "@/components/ui/Button";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";

export const metadata: Metadata = {
  title: "Sobre",
  description: ABOUT_CONTENT.subtitle,
};

export default function SobrePage() {
  return (
    <div className="bg-[#021729]">
      {/* Hero with editorial horizon image */}
      <section className="relative overflow-hidden border-b border-[#1E3A52]">
        <div className="absolute inset-0">
          <Image
            src={ABOUT_CONTENT.coverImage}
            alt="Horizonte sereno ao entardecer representando clareza e recomeço"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#021729]/85 via-[#021729]/80 to-[#021729]"
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
            Manifesto
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            {ABOUT_CONTENT.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#CBD5E1]">
            {ABOUT_CONTENT.subtitle}
          </p>
        </div>
      </section>

      {/* Official Manifesto Body */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-10">
          <p className="border-l-[3px] border-[#015E57] pl-5 text-base leading-relaxed text-white sm:text-lg">
            {ABOUT_CONTENT.opening}
          </p>

          <div className="mt-10 space-y-10">
            {ABOUT_CONTENT.sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="border-t border-[#1E3A52] pt-8 first:border-t-0 first:pt-0"
              >
                <h2 className="text-2xl font-semibold text-white">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-[#CBD5E1]">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-[#1E3A52] pt-8">
            <Link
              href="/haroldo"
              className={buttonClasses({ variant: "primary", size: "md" })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Conversar com o H.Aroldo</span>
            </Link>
            <Link
              href="/para-profissionais"
              className={buttonClasses({ variant: "secondary", size: "md" })}
            >
              <span>Sou profissional e quero me cadastrar</span>
            </Link>
            <Link
              href="/relatos"
              className={buttonClasses({ variant: "outline", size: "md" })}
            >
              <span>Ler relatos anônimos</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dedicated Emergency Channels Section */}
      <section
        id="canais-de-emergencia"
        aria-labelledby="canais-emergencia-titulo"
        className="border-t border-[#1E3A52] bg-[#021729]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                <span>Apoio imediato</span>
              </div>
              <h2
                id="canais-emergencia-titulo"
                className="text-2xl font-semibold text-white sm:text-3xl"
              >
                Canais de Emergência no Brasil
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#CBD5E1]">
                Se você estiver em situação de risco imediato, crise emocional
                aguda ou precisar de orientação jurídica gratuita, acione os
                serviços públicos abaixo.
              </p>
            </div>

            <Link
              href="/ajuda-urgente"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2DD4BF] transition-colors hover:text-white"
            >
              <span>Ver guia completo de ajuda urgente</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col justify-between rounded-xl border border-[#1E3A52] bg-[#112536] p-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">
                      {contact.name}
                    </h3>
                    <a
                      href={`tel:${contact.phone}`}
                      aria-label={`Ligar para ${contact.name} no número ${contact.phone}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#015E57] px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#027A71]"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{contact.phone}</span>
                    </a>
                  </div>

                  <p className="mt-2 text-xs font-medium text-[#2DD4BF]">
                    {contact.availability}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                    {contact.description}
                  </p>
                </div>

                {contact.website && (
                  <div className="mt-5 border-t border-[#1E3A52] pt-4">
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2DD4BF] transition-colors hover:text-white"
                    >
                      <span>Site oficial</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-14">
            <NewsletterBanner
              title="Acompanhe o projeto por e-mail"
              description="Enviamos novos textos sobre saúde emocional, limites e reconstrução de forma discreta. Seu e-mail nunca é compartilhado."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

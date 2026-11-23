import type { Metadata } from "next";
import { ProfessionalSignupForm } from "@/components/professionals/ProfessionalSignupForm";

export const metadata: Metadata = {
  title: "Para Profissionais",
  description:
    "Cadastre-se na Rede de Profissionais do Homem Abusado. Espaço para psicólogos, advogados, psiquiatras e terapeutas com registro ativo.",
};

export default function ParaProfissionaisPage() {
  return (
    <div className="bg-[#021729] py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-[#1E3A52] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2DD4BF]">
            Cadastro de especialistas
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Para Profissionais
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-[#CBD5E1]">
            Muitos homens chegam ao consultório ou ao escritório de advocacia
            depois de anos em silêncio. Se você atua com ética e escuta técnica
            em Psicologia, Direito de Família, Psiquiatria ou Terapia, preencha
            os dados abaixo para integrar a nossa rede.
          </p>
        </header>

        <ProfessionalSignupForm />
      </div>
    </div>
  );
}

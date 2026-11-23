import type { Metadata } from "next";
import { SafetyPlanChecklist } from "@/components/safety/SafetyPlanChecklist";

export const metadata: Metadata = {
  title: "Plano de Segurança",
  description:
    "Checklist prático e 100% local para organizar documentos, proteção financeira, segurança digital e rede de apoio com calma.",
};

export default function PlanoDeSegurancaPage() {
  return (
    <div className="bg-[#021729] py-12 sm:py-16 print:bg-white print:py-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl border-b border-[#1E3A52] pb-8 print:border-slate-300">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2DD4BF] print:text-slate-600">
            Organização prática
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl print:text-black">
            Plano de Segurança
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-[#CBD5E1] print:text-slate-700">
            Organizar passos concretos com antecedência reduz a ansiedade e
            devolve autonomia. Marque apenas o que faz sentido para a sua
            realidade atual, sem pressa.
          </p>
        </header>

        <SafetyPlanChecklist />
      </div>
    </div>
  );
}

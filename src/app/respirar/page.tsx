import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ShieldAlert, Wind } from "lucide-react";
import { BreathingGuide } from "@/components/breathing/BreathingGuide";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Respirar e Acalmar",
  description:
    "Espaço silencioso com guia de respiração 4-4-6 e checklist de aterramento 5-4-3-2-1 para recuperar o equilíbrio após momentos de tensão.",
};

export default function RespirarPage() {
  return (
    <div className="bg-[#021729]">
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <Wind className="h-4 w-4" aria-hidden="true" />
              <span>Pausa de Regulação</span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Respire com calma antes de decidir o próximo passo
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
              Depois de uma discussão intensa ou de um pico de ansiedade, o
              corpo permanece em estado de alerta. Use alguns minutos aqui para
              diminuir a tensão e recuperar clareza.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <BreathingGuide />

        <div className="mt-12 flex flex-col justify-between gap-6 rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold text-white">
              Quando estiver pronto para continuar
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Se quiser colocar o que aconteceu em palavras com privacidade,
              converse com o H.Aroldo. Se precisar de apoio humano imediato,
              acesse os telefones de emergência.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/haroldo"
              className={buttonClasses({ variant: "primary", size: "md" })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Conversar com o H.Aroldo</span>
            </Link>
            <Link
              href="/ajuda-urgente"
              className={buttonClasses({ variant: "secondary", size: "md" })}
            >
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              <span>Ajuda Urgente</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

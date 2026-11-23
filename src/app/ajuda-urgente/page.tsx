import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  ExternalLink,
  FileCheck2,
  MessageCircle,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { EMERGENCY_CONTACTS } from "@/data/about-content";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Ajuda Urgente",
  description:
    "Telefones de emergência gratuitos no Brasil, orientações práticas para documentar evidências com segurança e passos para planejar uma saída segura.",
};

const EVIDENCE_GUIDANCE = [
  "Guarde capturas de tela de mensagens, ameaças ou ofensas com data e hora visíveis.",
  "Salve cópias em uma conta de e-mail nova ou armazenamento em nuvem que a outra pessoa não tenha acesso.",
  "Mantenha um registro objetivo com datas, locais e descrição breve dos episódios mais graves.",
  "Em caso de agressão física, procure atendimento médico e guarde laudos, receitas e boletins de ocorrência.",
  "Evite confrontar a outra pessoa anunciando que está reunindo provas, pois isso pode elevar o risco no ambiente doméstico.",
];

const SAFE_EXIT_STEPS = [
  "Separe com discrição cópias dos seus documentos pessoais, certidões dos filhos, cartões e comprovantes de renda.",
  "Organize uma reserva financeira em conta exclusivamente sua, mesmo que pequena inicialmente.",
  "Escolha uma pessoa de confiança (familiar ou amigo) que saiba da sua situação e possa oferecer abrigo temporário.",
  "Consulte um advogado de família ou a Defensoria Pública (129) antes de sair de casa, principalmente quando há filhos ou bens em comum.",
  "Se houver risco físico imediato, priorize sua integridade: saia do local e ligue para a Polícia Militar (190) ou para o SAMU (192).",
];

export default function AjudaUrgentePage() {
  return (
    <div className="bg-[#021729]">
      {/* Calm, clear header */}
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              <span>Diretório de Emergência</span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Ajuda Urgente
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
              Se você está em perigo físico agora, passando por uma crise
              emocional aguda ou precisa de orientação jurídica imediata, use os
              canais gratuitos abaixo. Pressione ESC a qualquer momento para
              fechar esta página rapidamente.
            </p>
          </div>
        </div>
      </section>

      {/* Immediately scannable emergency directory */}
      <section
        aria-labelledby="telefones-uteis-titulo"
        className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2
          id="telefones-uteis-titulo"
          className="text-xl font-semibold text-white sm:text-2xl"
        >
          Telefones públicos de atendimento imediato
        </h2>

        <div className="mt-6 grid gap-4">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className="flex flex-col justify-between gap-5 rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:flex-row sm:items-center"
            >
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-white">
                  {contact.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-[#2DD4BF]">
                  {contact.availability}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                  {contact.description}
                </p>
                {contact.website && (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#2DD4BF] transition-colors hover:text-white"
                  >
                    <span>Acessar site oficial</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>

              <a
                href={`tel:${contact.phone}`}
                aria-label={`Ligar agora para ${contact.name} no número ${contact.phone}`}
                className={buttonClasses({
                  variant: "primary",
                  size: "lg",
                  className: "shrink-0 justify-center sm:min-w-[156px]",
                })}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Ligar {contact.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Practical Safety Guidance */}
      <section className="border-t border-[#1E3A52]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-8">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                <span>Registro seguro</span>
              </div>
              <h2 className="text-xl font-semibold text-white">
                Como documentar evidências com segurança
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                Quando não há perigo imediato, organizar registros factuais
                protege você em eventuais medidas jurídicas ou disputas de
                guarda.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#CBD5E1]">
                {EVIDENCE_GUIDANCE.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4BF]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-8">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>Planejamento</span>
              </div>
              <h2 className="text-xl font-semibold text-white">
                Como planejar uma saída segura
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                Sair de uma relação abusiva exige preparo prático para reduzir
                retaliações, bloqueios financeiros e exposição desnecessária.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#CBD5E1]">
                {SAFE_EXIT_STEPS.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4BF]"
                      aria-hidden="true"
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Calm link back to H.Aroldo */}
          <div className="mt-10 flex flex-col justify-between gap-6 rounded-xl border border-[#015E57] bg-[#112536] p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-white">
                Não está em risco físico imediato, mas precisa organizar a
                cabeça?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                Converse com o H.Aroldo em sigilo para colocar seus pensamentos
                em ordem, revisar seus próximos passos ou buscar um profissional
                no nosso diretório.
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
                href="/profissionais"
                className={buttonClasses({ variant: "secondary", size: "md" })}
              >
                <span>Ver profissionais</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

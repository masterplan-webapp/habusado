import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { buildCanonicalUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso, limites informativos e diretrizes de convivência e moderação do portal Homem Abusado.",
  alternates: {
    canonical: buildCanonicalUrl("/termos"),
  },
};

export default function TermosPage() {
  return (
    <div className="bg-[#021729]">
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>Regras de uso e convivência</span>
          </div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Termos de Uso
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
            Ao navegar e utilizar os recursos gratuitos do portal Homem Abusado,
            você concorda com os limites informativos e regras de segurança
            descritos abaixo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 text-sm leading-relaxed text-[#CBD5E1] sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              1. Natureza estritamente informativa
            </h2>
            <p className="mt-2">
              Os artigos, o Termômetro de Sinais, o assistente H.Aroldo e os
              guias práticos do portal têm finalidade exclusivamente informativa
              e de acolhimento inicial. Nenhum conteúdo substitui atendimento
              médico, psicológico, psiquiátrico ou orientação jurídica
              individualizada. Em situações de emergência, acione imediatamente
              o CVV (188), a Polícia Militar (190) ou o SAMU (192).
            </p>
          </div>

          <div className="border-t border-[#1E3A52] pt-6">
            <h2 className="text-xl font-semibold text-white">
              2. Regras de envio no Mural de Relatos, Respostas e Artigos
            </h2>
            <p className="mt-2">
              Para proteger todos os participantes, é proibido enviar conteúdos
              que contenham:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Nomes completos, endereços, telefones, CPFs, locais de trabalho
                ou qualquer dado capaz de identificar terceiros ou menores de
                idade.
              </li>
              <li>
                Ameaças, incentivo à violência, planos de vingança, discurso de
                ódio ou acusações criminais direcionadas a pessoas
                identificáveis.
              </li>
              <li>
                Conteúdo comercial, spam ou promoção não autorizada de serviços.
              </li>
            </ul>
            <p className="mt-3">
              Todo relato, resposta de apoio e artigo de colaborador passa por
              triagem automática e moderação humana prévia, podendo ser recusado
              ou editado para remover dados identificáveis antes da publicação.
            </p>
          </div>

          <div className="border-t border-[#1E3A52] pt-6">
            <h2 className="text-xl font-semibold text-white">
              3. Diretório de Profissionais
            </h2>
            <p className="mt-2">
              O portal realiza a conferência cadastral básica do número de
              registro informado (CRP, OAB ou CRM) antes da listagem pública,
              mas não intermedeia consultas, valores nem honorários. A relação
              profissional é estabelecida diretamente entre o usuário e o
              especialista escolhido.
            </p>
          </div>

          <div className="border-t border-[#1E3A52] pt-6">
            <h2 className="text-xl font-semibold text-white">
              4. Privacidade e remoção de conteúdo
            </h2>
            <p className="mt-2">
              O tratamento de dados segue nossa{" "}
              <Link
                href="/privacidade"
                className="text-[#2DD4BF] underline underline-offset-4 hover:text-white"
              >
                Política de Privacidade (LGPD)
              </Link>
              . Caso deseje solicitar a retirada de um relato, perfil
              profissional ou artigo, escreva para{" "}
              <a
                href="mailto:masterplan-webapp@gmail.com"
                className="text-[#2DD4BF] underline underline-offset-4 hover:text-white"
              >
                masterplan-webapp@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

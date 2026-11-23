import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buildCanonicalUrl } from "@/lib/site-url";
import { CookiePreferencesTrigger } from "@/components/legal/CookieConsentManager";

export const metadata: Metadata = {
  title: "Política de Privacidade e LGPD",
  description:
    "Como o portal Homem Abusado protege sua privacidade, quais dados nunca são armazenados e como exercer seus direitos conforme a Lei Geral de Proteção de Dados (LGPD).",
  alternates: {
    canonical: buildCanonicalUrl("/privacidade"),
  },
};

export default function PrivacidadePage() {
  return (
    <div className="bg-[#021729]">
      <section className="border-b border-[#1E3A52]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2DD4BF]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Lei nº 13.709/2018 (LGPD)</span>
          </div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Política de Privacidade e Proteção de Dados
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">
            Privacidade e discrição fazem parte da segurança de quem acessa este
            espaço. Explicamos abaixo, em linguagem direta, o que é tratado, o
            que nunca sai do seu navegador e como exercer seus direitos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-8 px-4 py-12 text-sm leading-relaxed text-[#CBD5E1] sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#1E3A52] bg-[#112536] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              1. Controlador dos Dados
            </h2>
            <p className="mt-2">
              O portal <strong>Homem Abusado</strong> é operado de forma
              independente por <strong>MasterPlan Digital Performance</strong>{" "}
              (CNPJ 70.115.203/0001-09). Para qualquer solicitação relacionada à
              LGPD, remoção de conteúdo ou dúvidas sobre privacidade, entre em
              contato pelo e-mail{" "}
              <a
                href="mailto:masterplan-webapp@gmail.com"
                className="text-[#2DD4BF] underline underline-offset-4 hover:text-white"
              >
                masterplan-webapp@gmail.com
              </a>
              .
            </p>
          </div>

          <div className="border-t border-[#1E3A52] pt-6">
            <h2 className="text-xl font-semibold text-white">
              2. O que NÃO armazenamos em banco de dados
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Conversas com o H.Aroldo (/haroldo):</strong> o modo
                efêmero mantém o histórico apenas na memória da aba aberta. Ao
                fechar a página ou clicar em apagar, nada fica salvo em nosso
                banco de dados.
              </li>
              <li>
                <strong>Termômetro de Sinais (/termometro):</strong> calculado
                exclusivamente no navegador, sem cadastro ou registro de
                respostas.
              </li>
              <li>
                <strong>
                  Diário Privado (/diario), Plano de Segurança
                  (/plano-de-seguranca) e Pausa para Respiração (/respirar):
                </strong>{" "}
                funcionam 100% localmente no seu dispositivo. Nenhum dado
                digitado nessas telas é enviado aos nossos servidores.
              </li>
            </ul>
          </div>

          <div className="border-t border-[#1E3A52] pt-6">
            <h2 className="text-xl font-semibold text-white">
              3. Dados tratados mediante envio voluntário e bases legais
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Newsletter:</strong> endereço de e-mail fornecido
                voluntariamente para recebimento de novos conteúdos (base legal:
                consentimento, Art. 7º, I da LGPD). Você pode solicitar
                descadastramento a qualquer momento.
              </li>
              <li>
                <strong>Mural de Relatos e Respostas de Apoio:</strong>{" "}
                pseudônimo, título e texto enviados voluntariamente. Todos os
                envios passam por filtro de segurança e revisão manual para
                evitar publicação de nomes reais, CPFs, telefones ou endereços
                (base legal: consentimento).
              </li>
              <li>
                <strong>Cadastro de Profissionais (/para-profissionais):</strong>{" "}
                nome, especialidade, número de registro de classe (CRP, OAB ou
                CRM), cidade/estado, biografia e link de contato, usados para
                verificação e exibição pública no diretório após aprovação.
              </li>
              <li>
                <strong>Colaboradores de Artigos (/colaboradores):</strong>{" "}
                nome, credenciais, biografia, texto enviado e e-mail editorial
                interno. O e-mail do colaborador nunca é exibido publicamente.
              </li>
              <li>
                <strong>Segurança e prevenção contra abuso:</strong> o endereço
                IP pode ser processado temporariamente em memória para limitar
                rajadas automatizadas (rate limit) nas rotas públicas, sem
                criação de perfil de navegação.
              </li>
            </ul>
          </div>

          <div className="border-t border-[#1E3A52] pt-6">
            <h2 className="text-xl font-semibold text-white">
              4. Cookies e Google Analytics 4 (Consent Mode)
            </h2>
            <p className="mt-2">
              Cookies de medição (Google Analytics 4) começam{" "}
              <strong>desativados por padrão</strong> e só são habilitados se
              você clicar em <strong>Aceitar medição (GA4)</strong> no aviso de
              privacidade. Caso escolha <strong>Apenas essenciais</strong>,
              nenhuma medição analítica é ativada.
            </p>
            <div className="mt-4">
              <CookiePreferencesTrigger />
            </div>
          </div>

          <div className="border-t border-[#1E3A52] pt-6">
            <h2 className="text-xl font-semibold text-white">
              5. Operadores de infraestrutura e transferência internacional
            </h2>
            <p className="mt-2">
              Para manter o portal no ar, utilizamos provedores com padrões
              reconhecidos de segurança e criptografia em trânsito (HTTPS):
              Vercel (hospedagem), Supabase (banco de dados PostgreSQL com
              políticas de acesso restrito), Google Gemini API (processamento em
              tempo real das respostas do H.Aroldo e triagem de segurança) e
              Resend (envio de e-mails transacionais). Parte desses servidores
              opera fora do Brasil, sob salvaguardas contratuais compatíveis com
              o Art. 33 da LGPD.
            </p>
          </div>

          <div className="border-t border-[#1E3A52] pt-6">
            <h2 className="text-xl font-semibold text-white">
              6. Seus direitos como titular (Art. 18 da LGPD)
            </h2>
            <p className="mt-2">
              Você pode solicitar a qualquer momento: confirmação da existência
              de tratamento, acesso aos seus dados, correção de informações
              incompletas ou desatualizadas, anonimização, exclusão de relato,
              descadastramento da newsletter ou revogação de consentimento.
              Basta enviar uma mensagem para{" "}
              <a
                href="mailto:masterplan-webapp@gmail.com"
                className="text-[#2DD4BF] underline underline-offset-4 hover:text-white"
              >
                masterplan-webapp@gmail.com
              </a>
              .
            </p>
          </div>

          <div className="border-t border-[#1E3A52] pt-6 text-xs text-[#94A3B8]">
            <p>
              Consulte também os{" "}
              <Link
                href="/termos"
                className="text-[#2DD4BF] underline underline-offset-4 hover:text-white"
              >
                Termos de Uso
              </Link>{" "}
              e o guia de{" "}
              <Link
                href="/privacidade-digital"
                className="text-[#2DD4BF] underline underline-offset-4 hover:text-white"
              >
                Privacidade Digital
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

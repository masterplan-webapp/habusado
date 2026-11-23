import { getAllArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/site-url";
import { GLOSSARY_TERMS } from "@/data/glossary-terms";
import { EMERGENCY_CONTACTS } from "@/data/about-content";

export const revalidate = 300;

export async function GET() {
  const baseUrl = getSiteUrl();
  const articles = await getAllArticles();

  const lines: string[] = [
    "# Homem Abusado",
    "",
    "> Hub brasileiro gratuito de informação qualificada, acolhimento sigiloso, ferramentas práticas e conexão com profissionais especializados para homens que vivem ou viveram relacionamentos abusivos.",
    "",
    `Site oficial: ${baseUrl}`,
    "Idioma: pt-BR",
    "Newsletter original: https://homemabusado.substack.com",
    "",
    "## O que este portal oferece",
    `- [Página inicial](${baseUrl}/): visão geral dos pilares de acolhimento, artigos recentes e newsletter.`,
    `- [H.Aroldo - Escuta Ativa](${baseUrl}/haroldo): conversa sigilosa em modo efêmero para organizar pensamentos, identificar dinâmicas abusivas e acionar protocolo de crise quando necessário.`,
    `- [Termômetro de Sinais](${baseUrl}/termometro): questionário anônimo de 10 perguntas objetivas sobre dinâmicas cotidianas no relacionamento.`,
    `- [Artigos e Guias](${baseUrl}/artigos): biblioteca editorial sobre Sinais de Abuso, Reconstrução, Paternidade e Família e Saúde Mental.`,
    `- [Glossário de Dinâmicas Abusivas](${baseUrl}/glossario): definições práticas com exemplos cotidianos (${GLOSSARY_TERMS.map((t) => t.term).join(", ")}).`,
    `- [Guia de Direitos, Provas e Paternidade](${baseUrl}/direitos): orientações informativas sobre preservação lícita de provas, guarda, alienação parental, defesa contra falsas acusações, boletim de ocorrência e Defensoria Pública.`,
    `- [Plano de Segurança e Saída](${baseUrl}/plano-de-seguranca): checklist 100% local no navegador para organizar documentos, finanças, privacidade digital e rede de apoio.`,
    `- [Diário Privado de Episódios](${baseUrl}/diario): bloco 100% local no navegador para registrar fatos objetivos com data e exportar em TXT.`,
    `- [Pausa para Respiração](${baseUrl}/respirar): exercício visual 4-4-6 e técnica de aterramento 5-4-3-2-1 para momentos após conflitos.`,
    `- [Privacidade Digital](${baseUrl}/privacidade-digital): passo a passo para aba anônima, limpeza de histórico, localização compartilhada e sessões ativas.`,
    `- [Mural de Relatos](${baseUrl}/relatos): histórias anônimas moderadas e mensagens de apoio pré-moderadas.`,
    `- [Rede de Profissionais](${baseUrl}/profissionais): diretório filtrável de psicólogos (CRP), advogados (OAB), psiquiatras (CRM) e terapeutas com atendimento presencial e online no Brasil.`,
    `- [Sobre o Homem Abusado](${baseUrl}/sobre): manifesto, missão e história do projeto.`,
    `- [Ajuda Urgente](${baseUrl}/ajuda-urgente): telefones públicos de emergência e orientação imediata no Brasil.`,
    `- [Política de Privacidade (LGPD)](${baseUrl}/privacidade): transparência de dados, Consent Mode e direitos do titular.`,
    `- [Termos de Uso](${baseUrl}/termos): limites informativos e regras de moderação.`,
    "",
    "## Canais de Emergência no Brasil",
    ...EMERGENCY_CONTACTS.map(
      (c) => `- **${c.name} (${c.phone})**: ${c.description} (${c.availability}).`
    ),
    "",
    "## Artigos Publicados",
    ...articles.map(
      (a) =>
        `- [${a.title}](${baseUrl}/artigos/${a.slug}) (${a.category}, ${a.readTime}): ${a.excerpt}`
    ),
    "",
    "## Limites Editoriais",
    "- Todo conteúdo deste portal tem caráter informativo e acolhedor.",
    "- O portal não realiza diagnósticos clínicos ou psicológicos e não substitui atendimento médico, psicológico ou jurídico individualizado.",
    "- A tecla ESC aciona saída rápida imediata em qualquer página para proteger usuários em ambientes monitorados.",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

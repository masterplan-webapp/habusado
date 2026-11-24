import crypto from "node:crypto";
import { sendEmailSafe } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { ArticleMeta } from "@/lib/types";

export interface NewsletterArticleSummary {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getUnsubscribeSecret(): string {
  return (
    process.env.CRON_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "homem-abusado-unsubscribe-fallback"
  );
}

export function createUnsubscribeToken(email: string): string {
  const normalized = email.trim().toLowerCase();
  return crypto
    .createHmac("sha256", getUnsubscribeSecret())
    .update(`unsubscribe:${normalized}`, "utf8")
    .digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = createUnsubscribeToken(email);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(token.trim(), "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function buildUnsubscribeUrl(email: string): string {
  const baseUrl = getSiteUrl();
  const normalized = email.trim().toLowerCase();
  const token = createUnsubscribeToken(normalized);
  return `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(
    normalized
  )}&token=${encodeURIComponent(token)}`;
}

export function buildWelcomeDigestHtml(
  articles: ArticleMeta[],
  recipientEmail: string
): string {
  const baseUrl = getSiteUrl();
  const unsubscribeUrl = buildUnsubscribeUrl(recipientEmail);
  const recentArticles = articles.slice(0, 5);

  const articlesHtml = recentArticles
    .map((article) => {
      const articleUrl = `${baseUrl}/artigos/${article.slug}`;
      return `
        <div style="margin: 0 0 18px 0; padding: 16px; border: 1px solid #E2E8F0; border-radius: 10px; background: #F8FAFC;">
          <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #015E57;">
            ${escapeHtml(article.category)} · ${escapeHtml(article.readTime)}
          </p>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.35; color: #021729;">
            <a href="${articleUrl}" style="color: #021729; text-decoration: none;">${escapeHtml(article.title)}</a>
          </h3>
          <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #334155;">
            ${escapeHtml(article.excerpt)}
          </p>
          <a href="${articleUrl}" style="font-size: 13px; font-weight: 600; color: #015E57; text-decoration: underline;">
            Ler artigo completo
          </a>
        </div>
      `;
    })
    .join("");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.65; max-width: 600px; margin: 0 auto; padding: 24px 16px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #015E57;">
        h/a homem abusado
      </p>
      <h1 style="margin: 0 0 16px 0; font-size: 22px; line-height: 1.3; color: #021729;">
        Inscrição confirmada na newsletter
      </h1>
      <p style="margin: 0 0 14px 0; font-size: 15px; color: #1E293B;">
        Olá. Seu e-mail foi cadastrado de forma discreta. Toda terça-feira às 10h (horário de Brasília), você receberá o novo artigo publicado no portal.
      </p>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #1E293B;">
        Para começar, reunimos abaixo um resumo dos textos mais recentes já disponíveis:
      </p>
      ${articlesHtml}
      <div style="margin: 24px 0; padding: 16px; border-radius: 10px; background: #021729; color: #FFFFFF;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #CBD5E1;">
          Se precisar organizar seus pensamentos agora, você também pode usar as ferramentas gratuitas e sigilosas do portal:
        </p>
        <p style="margin: 0; font-size: 14px;">
          <a href="${baseUrl}/haroldo" style="color: #2DD4BF; font-weight: 600; text-decoration: underline; margin-right: 16px;">Conversar com o H.Aroldo</a>
          <a href="${baseUrl}/termometro" style="color: #2DD4BF; font-weight: 600; text-decoration: underline;">Termômetro de Sinais</a>
        </p>
      </div>
      <p style="margin: 20px 0 0 0; font-size: 12px; color: #64748B;">
        Este e-mail foi enviado porque você se inscreveu em ${escapeHtml(baseUrl)}. Se preferir não receber novas mensagens, clique em
        <a href="${unsubscribeUrl}" style="color: #015E57; text-decoration: underline;">cancelar inscrição</a>.
      </p>
    </div>
  `;
}

export function buildWeeklyArticleEmailHtml(
  article: NewsletterArticleSummary,
  recipientEmail: string
): string {
  const baseUrl = getSiteUrl();
  const articleUrl = `${baseUrl}/artigos/${article.slug}`;
  const unsubscribeUrl = buildUnsubscribeUrl(recipientEmail);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #021729; line-height: 1.65; max-width: 600px; margin: 0 auto; padding: 24px 16px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #015E57;">
        h/a homem abusado · Edição semanal
      </p>
      <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #475569;">
        ${escapeHtml(article.category)}${article.readTime ? ` · ${escapeHtml(article.readTime)}` : ""}
      </p>
      <h1 style="margin: 0 0 14px 0; font-size: 23px; line-height: 1.3; color: #021729;">
        ${escapeHtml(article.title)}
      </h1>
      <p style="margin: 0 0 22px 0; font-size: 15px; color: #1E293B;">
        ${escapeHtml(article.excerpt)}
      </p>
      <p style="margin: 0 0 26px 0;">
        <a href="${articleUrl}" style="display: inline-block; padding: 12px 20px; background: #015E57; color: #FFFFFF; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;">
          Ler artigo completo no site
        </a>
      </p>
      <p style="margin: 0 0 18px 0; font-size: 13px; color: #475569;">
        Precisa conversar em sigilo? O <a href="${baseUrl}/haroldo" style="color: #015E57; text-decoration: underline;">H.Aroldo</a> está disponível gratuitamente a qualquer hora.
      </p>
      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
      <p style="margin: 0; font-size: 12px; color: #64748B;">
        Você recebeu esta edição porque assinou a newsletter do Homem Abusado. Para sair da lista com um clique, acesse
        <a href="${unsubscribeUrl}" style="color: #015E57; text-decoration: underline;">cancelar inscrição</a>.
      </p>
    </div>
  `;
}

export async function sendWeeklyNewsletterToSubscribers(
  articles: NewsletterArticleSummary[]
): Promise<{ totalSubscribers: number; sentCount: number; failedCount: number }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase || articles.length === 0) {
    return { totalSubscribers: 0, sentCount: 0, failedCount: 0 };
  }

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("email")
    .eq("active", true);

  if (error || !subscribers || subscribers.length === 0) {
    return { totalSubscribers: 0, sentCount: 0, failedCount: 0 };
  }

  const primaryArticle = articles[0];
  let sentCount = 0;
  let failedCount = 0;

  for (const row of subscribers) {
    const email = typeof row.email === "string" ? row.email.trim() : "";
    if (!email) continue;

    const result = await sendEmailSafe({
      to: email,
      subject: `Novo artigo: ${primaryArticle.title}`,
      html: buildWeeklyArticleEmailHtml(primaryArticle, email),
    });

    if (result.sent) {
      sentCount += 1;
    } else if (!result.skipped) {
      failedCount += 1;
    }
  }

  return {
    totalSubscribers: subscribers.length,
    sentCount,
    failedCount,
  };
}

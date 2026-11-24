import { verifyUnsubscribeToken } from "@/lib/newsletter-emails";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

function renderHtmlPage(title: string, message: string): Response {
  const baseUrl = getSiteUrl();
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${title} | Homem Abusado</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#021729;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:24px;">
  <main style="max-width:480px;width:100%;background:#112536;border:1px solid #1E3A52;border-radius:12px;padding:32px;">
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#2DD4BF;">h/a homem abusado</p>
    <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;">${title}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#CBD5E1;">${message}</p>
    <a href="${baseUrl}" style="display:inline-block;padding:10px 18px;background:#015E57;color:#ffffff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">Voltar ao portal</a>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const token = searchParams.get("token")?.trim() ?? "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return renderHtmlPage(
      "Link de descadastro inválido",
      "Não foi possível validar este link. Se quiser sair da newsletter, responda a qualquer e-mail recebido ou escreva para masterplan-webapp@gmail.com."
    );
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    await supabase
      .from("subscribers")
      .update({ active: false })
      .eq("email", email);
  }

  return renderHtmlPage(
    "Inscrição cancelada",
    "Seu e-mail foi removido da lista de envios semanais do Homem Abusado. Você não receberá novas edições da newsletter."
  );
}

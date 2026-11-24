import { getAllArticles } from "@/lib/articles";
import { buildWelcomeDigestHtml } from "@/lib/newsletter-emails";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getSupabaseClient } from "@/lib/supabase";
import { sendEmailSafe } from "@/lib/resend";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const rate = checkRateLimit(request, {
    keyPrefix: "newsletter",
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rate.allowed) {
    return createRateLimitResponse(rate.retryAfterSeconds);
  }

  let payload: { email?: unknown };
  try {
    payload = (await request.json()) as { email?: unknown };
  } catch {
    return Response.json(
      { error: "Dados inválidos na requisição." },
      { status: 400 }
    );
  }

  const rawEmail = typeof payload.email === "string" ? payload.email.trim() : "";
  const email = rawEmail.toLowerCase();

  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return Response.json(
      { error: "Informe um endereço de e-mail válido." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdminClient() ?? getSupabaseClient();
  let alreadySubscribed = false;
  let storedInSupabase = false;

  if (supabase) {
    const { error } = await supabase
      .from("subscribers")
      .insert({ email, active: true });

    if (error) {
      if (error.code === "23505") {
        alreadySubscribed = true;
      } else {
        console.error("[api/newsletter] Supabase insert error:", error);
        return Response.json(
          { error: "Não foi possível salvar sua inscrição agora. Tente novamente." },
          { status: 500 }
        );
      }
    } else {
      storedInSupabase = true;
    }
  }

  if (!alreadySubscribed) {
    const articles = await getAllArticles();
    await sendEmailSafe({
      to: email,
      subject: "Inscrição confirmada: resumo dos artigos do Homem Abusado",
      html: buildWelcomeDigestHtml(articles, email),
    });
  }

  if (alreadySubscribed) {
    return Response.json(
      {
        ok: true,
        alreadySubscribed: true,
        message: "Este e-mail já está inscrito na nossa lista.",
      },
      { status: 200 }
    );
  }

  return Response.json(
    {
      ok: true,
      previewMode: !storedInSupabase,
      message:
        "Inscrição confirmada. Você receberá nossos próximos textos por e-mail.",
    },
    { status: 201 }
  );
}

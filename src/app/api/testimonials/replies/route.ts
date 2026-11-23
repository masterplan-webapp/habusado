import { NextResponse } from "next/server";
import { moderateCommunityText } from "@/lib/moderation";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";
import { notifyAdminSafe } from "@/lib/resend";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getSupabaseClient } from "@/lib/supabase";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  const rate = checkRateLimit(request, {
    keyPrefix: "testimonial-replies",
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rate.allowed) {
    return createRateLimitResponse(rate.retryAfterSeconds);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const payload = body as Record<string, unknown>;
  const testimonialId =
    typeof payload.testimonialId === "string"
      ? payload.testimonialId.trim()
      : "";
  const pseudonym =
    typeof payload.pseudonym === "string" ? payload.pseudonym.trim() : "";
  const content =
    typeof payload.content === "string" ? payload.content.trim() : "";

  if (!testimonialId) {
    return NextResponse.json(
      { error: "Relato de destino inválido." },
      { status: 400 }
    );
  }

  if (pseudonym.length < 2 || pseudonym.length > 60) {
    return NextResponse.json(
      { error: "Informe um pseudônimo com 2 a 60 caracteres." },
      { status: 400 }
    );
  }

  if (content.length < 10 || content.length > 1500) {
    return NextResponse.json(
      { error: "A mensagem de apoio precisa ter entre 10 e 1500 caracteres." },
      { status: 400 }
    );
  }

  const moderation = await moderateCommunityText(content);
  if (moderation.isCrisis) {
    return NextResponse.json(
      {
        error:
          moderation.userMessage ??
          "Percebemos sinais de sofrimento intenso. Procure apoio humano imediato: CVV 188, Polícia Militar 190 ou SAMU 192.",
        isCrisis: true,
      },
      { status: 422 }
    );
  }

  if (!moderation.allowed) {
    return NextResponse.json(
      {
        error:
          moderation.userMessage ??
          "Sua mensagem não pôde ser enviada pelas regras de privacidade e segurança da comunidade.",
      },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdminClient() ?? getSupabaseClient();
  let persisted = false;

  if (supabase && UUID_REGEX.test(testimonialId)) {
    const { error } = await supabase.from("testimonial_replies").insert({
      testimonial_id: testimonialId,
      pseudonym,
      content,
      status: "pending",
      moderation_flag: moderation.flag ?? "ok",
    });

    if (error) {
      console.error("[api/testimonials/replies] Supabase insert error:", error);
      return NextResponse.json(
        {
          error:
            "Não foi possível registrar sua mensagem agora. Tente novamente em alguns instantes.",
        },
        { status: 500 }
      );
    }

    persisted = true;
  }

  await notifyAdminSafe(
    `[Homem Abusado] Nova mensagem de apoio pendente`,
    `
      <h2>Nova mensagem de apoio enviada para moderação</h2>
      <p><strong>ID do relato:</strong> ${escapeHtml(testimonialId)}</p>
      <p><strong>Pseudônimo:</strong> ${escapeHtml(pseudonym)}</p>
      <p><strong>Mensagem:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(content)}</p>
      <hr />
      <p>Revise antes de aprovar a publicação na tabela testimonial_replies.</p>
    `
  );

  return NextResponse.json(
    {
      ok: true,
      persisted,
      message:
        "Sua mensagem de apoio foi recebida. Ela passa por revisão de segurança antes de aparecer abaixo do relato.",
    },
    { status: 201 }
  );
}

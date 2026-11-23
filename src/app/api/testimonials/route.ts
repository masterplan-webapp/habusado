import { NextResponse } from "next/server";
import { SEED_TESTIMONIALS } from "@/data/seed-testimonials";
import { moderateCommunityText } from "@/lib/moderation";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";
import { notifyAdminSafe } from "@/lib/resend";
import { getSupabaseClient } from "@/lib/supabase";
import type { Testimonial, TestimonialReply } from "@/lib/types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function GET() {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select(
          "id, pseudonym, title, content, status, support_count, created_at"
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const { data: repliesData } = await supabase
          .from("testimonial_replies")
          .select("id, testimonial_id, pseudonym, content, status, created_at")
          .eq("status", "approved")
          .order("created_at", { ascending: true });

        const repliesByStory = new Map<string, TestimonialReply[]>();
        if (Array.isArray(repliesData)) {
          for (const reply of repliesData as TestimonialReply[]) {
            const list = repliesByStory.get(reply.testimonial_id) ?? [];
            list.push(reply);
            repliesByStory.set(reply.testimonial_id, list);
          }
        }

        const dbItems = (data as Testimonial[]).map((item) => ({
          ...item,
          support_count: item.support_count ?? 0,
          replies: repliesByStory.get(item.id) ?? [],
        }));

        const seenIds = new Set(dbItems.map((item) => item.id));
        const merged = [
          ...dbItems,
          ...SEED_TESTIMONIALS.filter((item) => !seenIds.has(item.id)),
        ];
        return NextResponse.json({ testimonials: merged });
      }
    } catch {
      // Fallback to seed data when Supabase is unavailable.
    }
  }

  return NextResponse.json({ testimonials: SEED_TESTIMONIALS });
}

export async function POST(request: Request) {
  const rate = checkRateLimit(request, {
    keyPrefix: "testimonials",
    limit: 5,
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
  const pseudonym =
    typeof payload.pseudonym === "string" ? payload.pseudonym.trim() : "";
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const content =
    typeof payload.content === "string" ? payload.content.trim() : "";

  if (pseudonym.length < 2 || pseudonym.length > 60) {
    return NextResponse.json(
      { error: "Informe um pseudônimo com 2 a 60 caracteres." },
      { status: 400 }
    );
  }

  if (title.length < 5 || title.length > 140) {
    return NextResponse.json(
      { error: "Informe um título com 5 a 140 caracteres." },
      { status: 400 }
    );
  }

  if (content.length < 30 || content.length > 4000) {
    return NextResponse.json(
      { error: "O relato precisa ter entre 30 e 4000 caracteres." },
      { status: 400 }
    );
  }

  const moderation = await moderateCommunityText(`${title}\n\n${content}`);
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
          "Seu relato não pôde ser enviado pelas regras de segurança e privacidade da comunidade.",
      },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();
  let persisted = false;

  if (supabase) {
    const { error } = await supabase.from("testimonials").insert({
      pseudonym,
      title,
      content,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            "Não foi possível registrar seu relato agora. Tente novamente em alguns instantes.",
        },
        { status: 500 }
      );
    }

    persisted = true;
  }

  await notifyAdminSafe(
    `[Homem Abusado] Novo relato pendente: ${title}`,
    `
      <h2>Novo relato enviado para moderação</h2>
      <p><strong>Pseudônimo:</strong> ${escapeHtml(pseudonym)}</p>
      <p><strong>Título:</strong> ${escapeHtml(title)}</p>
      <p><strong>Relato:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(content)}</p>
      <hr />
      <p>Revise nomes reais e dados identificáveis antes de aprovar a publicação no Supabase.</p>
    `
  );

  return NextResponse.json(
    {
      ok: true,
      persisted,
      message:
        "Seu relato foi recebido. Nossa equipe fará a moderação para remover nomes reais ou dados identificáveis antes da publicação no mural.",
    },
    { status: 201 }
  );
}
